'use strict'

const path=require('path')
const File=require('../../../database/collections/avatar')
const User = require('../../../database/collections/user')
const multer=require('multer')
const sha1 = require('sha1');

const fs=require('fs')

//--------------configuracion de mulkter para que reciba archivos----------------------
    const storage = multer.diskStorage({
        destination: "./public/avatar",
        filename:function(req, file, cb){
            // console.log('----upload file----');
            // console.log(file);
            var extencionArchivo=path.extname(file.originalname)   // el modulo path extrae la extencion del archivo ,MP4 .JPG

            console.log(extencionArchivo)
            // console.log(file);
            
            // cb(null, "VIDEO_"+Date.now()+".mp4") 
            cb(null, "IMG_"+Date.now()+extencionArchivo) 
        }
    })

    var upload = multer({
        storage:storage
    }).single("image");




// funcion que muestra que actualiza la foto de perfil de un usuario
async function uploadFileAvatar(req,res){
       
        upload(req, res, (err) => {
            // console.log(req.file)       //para  verificar que la imagen lleag a la api
            console.log('llego file');
            console.log(req.file)
            console.log(req.params.idUser)
            
            const IDUSER = req.params.idUser


           if(err){
               res.status(500).json({
                   "message":"No se pude guadar el archivo"
               })
           }else{
               var ruta = req.file.path.substr(6, req.file.path.length);   //estraea la ruta, quita public   y solo queda \video\VIDEO_1558896752374.MP4
               console.log('esta es la ruta ------>') 
            //    console.log(req.file);
                var host=req.headers.host         
               console.log(host)
    
               var filedata = {
                   idUser:IDUSER,
                   originalname:req.file.originalname,
                   filename: req.file.filename,
                   Physicalpath: req.file.path,
                   relativepath: 'http://localhost:3005',
                   linkfile:'http://localhost:3005'+ruta,
                   size: req.file.size
               }
            //    console.log(filedata);
    
               var file=new File(filedata);

               file.save().then((infofile)=>{
                   console.log(infofile);
                    
                   User.findByIdAndUpdate({_id:IDUSER},{avatarImage:infofile.linkfile},(err,doc)=>{
                       console.log(doc)

                   })
                   
               })
               
           };
           
           
           var rutafile=req.file.path.split('public')
        //    console.log(rutafile[1]);
           
           var ruta =file.relativepath+rutafile[1]
           console.log(ruta);
          
           res.status(200).send(file)
           
        })

}

// funcion que devuelve la imagaen del avatar

async function showAvatarImage(req,res){

    const IDUSER = req.params.idUser;
    
    if(IDUSER){
            User.findById({_id:IDUSER},(err,doc)=>{
                if(err){
                    // console.log(err)
                    res.send({message:'error'})
                    return
                }
                if(doc){

                    var linkAvatar={
                        idUser:doc._id,
                        linkAvatar:doc.avatarImage
                    }
                    console.log(linkAvatar)
                    res.send(linkAvatar)
                }
            });
    }
}



// funcino que muestra los datos del usurio
async function showDataUser(req, res){

    const IDUSER = req.params.iduser;
    const dataUser = await User.findById({_id:IDUSER}).exec()
    res.send(dataUser)
}


// fucion que actualiza los datos de un usuario
async function UpdateDataUser(req, res){

    const IDUSER = req.body.idUser;
    const ROLE = req.body.role;
    

   const dataUser = await User.findById({_id:IDUSER}).exec()

   console.log(dataUser)
  
         var newData={
                name: req.body.name,
                lastname: req.body.lastname,
                motherlastename: req.body.motherlastename,
                phone: req.body.phone,
                
            }
 
    User.findByIdAndUpdate({_id:IDUSER},newData, (err, doc)=>{

    })

   res.send(dataUser)
}


// seguridad, actualizar la correo o ru  la contraceña o clavede ususuiar

async function updateSegurityEmailCI(req, res){

    const IDUSEER = req.body.idUser;
    const newEmailCI = req.body.newEmailCI;
    
    if(!newEmailCI  || !IDUSEER ){
        res.status(500).send({message: 'Datos requreridos incomletos'})
        return
    }
    

   User.findById({_id:IDUSEER},(err,doc)=>{
       if(err){
           res.status(400).send({err:'usuario no encomtrado'})
       }
       if(doc ){

        if(doc.ci){

            console.log(doc.role)
            const newDataEmailCI={
                ci:req.body.newEmailCI,
                sha1EmailCI:sha1(req.body.newEmailCI)
            }
    
            console.log(newDataEmailCI)

            User.findByIdAndUpdate({_id:IDUSEER},newDataEmailCI,(err1,d)=>{
                if(err1){
                    console.log({err:'emailCI no se actualizo'})
                    res.status(200).send({message:'datos no actualizado'})
                    return

                }
                if(d){
                    console.log({message:'emailCI se actulizo correctante'})
                    res.status(200).send({message:'emailCI actualizado'})
                    return
                }
            })


        }
        if(!doc.ci){

            console.log(doc.role)
            const newDataEmailCI={
                email:req.body.newEmailCI,
                sha1EmailCI:sha1(req.body.newEmailCI)
            }
            
            console.log(newDataEmailCI)

            User.findByIdAndUpdate({_id:IDUSEER},newDataEmailCI,(err2,d)=>{
                if(err2){
                    console.log({err:'datos no actualizados'})
                    res.status(400).send({message:'datos no actualizados'})

                }
                if(d){
                    console.log({message:'emailCI actualizado'})
                    res.status(200).send({message:'datos actualizados'})

                }
            })

        }
        //    res.status(200).send(doc)
       }
   })

  
        
}
async function updatePassowrdClaveM(req,res){

    const IDUSER = req.body.idUser;
    
    const actualPassord = req.body.actualPassword
    const newPasswordClaveM = req.body.newPasswordClaveM

    if(!IDUSER || !actualPassord  || !newPasswordClaveM){
        console.log({err:'datos requeridos incompletos'})
        res.status(400).send({err:'datos reueridos incompletos'})
        return
    }

    User.findById({_id:IDUSER},(err,doc)=>{
        if(err){
            console.log({err:'updatePassowrdClaveM usuario no enctrado'})
            res.status(400).send({err:'usuario no encontrado'})
        }


        if(doc){
            if(doc.ci){
                const newPasswordClaveM={
                    claveMatricula:req.body.newPasswordClaveM,
                    sha1PassowrdClaveM:sha1(req.body.newPasswordClaveM)
                }
                User.findByIdAndUpdate({_id:IDUSER},newPasswordClaveM,(err1,d1)=>{
                    if(err1){
                        console.log({err:'passoword error en la actualizacion '})
                        res.status(400).send({err:'error en la actualcion de password'})
                    }
                    if(d1){
                        console.log({message:'passwordClaveM actualizado'})
                        res.status(200).send({message:'passwordClaveM actualizado'})
                    }
                })
            }

            if(!doc.ci){
                const newPasswordClaveM={
                    password:req.body.newPasswordClaveM,
                    sha1PassowrdClaveM:sha1(req.body.newPasswordClaveM)
                }
                User.findByIdAndUpdate({_id:IDUSER},newPasswordClaveM,(err1,d1)=>{
                    if(err1){
                        console.log({err:'passoword error en la actualizacion '})
                        res.status(400).send({err:'error en la actualcion de password'})
                    }
                    if(d1){
                        console.log({message:'passwordClaveM actualizado'})
                        res.status(200).send({message:'passwordClaveM actualizado'})
                    }
                })
            }

        }
    })

}




module.exports={
    uploadFileAvatar,
    showAvatarImage,
    UpdateDataUser,
    showDataUser,
    updateSegurityEmailCI,
    updatePassowrdClaveM
}