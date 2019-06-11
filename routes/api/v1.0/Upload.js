'use strict'

const path=require('path')
const File=require('../../../database/collections/file')
const multer=require('multer')

const fs=require('fs')

//--------------configuracion de mulkter para que reciba archivos----------------------
    const storage = multer.diskStorage({
        destination: "./public/poster",
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
    }).single("video");


function uploadFile(req,res){
       
        upload(req, res, (err) => {
            // console.log(req.file)       //para  verificar que la imagen lleag a la api
            console.log('llego file');
            console.log(req.file)
           
            
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
    
                   console.log('--------------');
                   
                   console.log(infofile._id);
                   
                   console.log(infofile.linkfile)
                   
               })
               
           };
           
           
           var rutafile=req.file.path.split('public')
        //    console.log(rutafile[1]);
           
           var ruta =file.relativepath+rutafile[1]
           console.log(ruta);
          
           res.status(200).send(file)
           
        })

}
//  F:\proyectos_de_nodejs_2019\apirest-server-images-fazt\public\video\VIDEO_1558820855304.mp4



module.exports={
    uploadFile
}