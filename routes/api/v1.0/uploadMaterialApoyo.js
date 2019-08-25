'use strict'

const path = require('path');
const MaterialApoyoconst = require('../../../database/collections/materialApoyo');
const multer = require('multer');



// ---configuration of mukter--------

const storage = multer.diskStorage({
    destination: "./public/MaterialApoyo",
    filename:function(req, file, cb){
        var extencionArchivo = path.extname(file.originalname)
        console.log(extencionArchivo)
        cb(null,"FILE_"+Date.now()+extencionArchivo)
    }
})

var upload = multer({
    storage:storage
}).single("file");

function MaterialApoyo(req, res){

    upload(req,res,(err)=>{

        console.log(req.file)
        console.log(req.params.idVideo)
        console.log(req.params.filename)

        const idVideo = req.params.idVideo;
        const filename= req.params.filename;

        if(err){
            console.log('no se puede guardar el archivo');
            res.status(200).send({message:'no se puede guardar el archivo'})
        }else{
            var ruta = req.file.path.substr(6,req.file.path.length);
            console.log(ruta)
            var host=req.headers.host;
            console.log(host)

            var materialApoyo={
                idVideo:idVideo,
                originalname:req.file.filename,
                filename:filename,
                relativepath: 'http://localhost:3005',
                linkfile:'http://localhost:3005'+ruta,
                size: req.file.size
            }

            var material = new MaterialApoyoconst.MaterialesApoyo(materialApoyo)

            var aux;
            material.save().then((infomaterial)=>{
                console.log('------infomaterial----')
                console.log(infomaterial)
                res.status(200).send(infomaterial)
                
                })

                
        


            console.log(materialApoyo)
        }
    })
}


// links (recursos del curso)

function Links(req, res){

    var link={
        idVideo:req.body.idVideo,
        nameLink:req.body.nameLink,
        link:req.body.link
    }
   

    var objLink= new MaterialApoyoconst.links(link)
    objLink.save().then((data)=>{
        console.log(data)
        res.status(200).send(data)
    })


    console.log(link)
}

// monstrar los recursos
function showMaterialapoyo(req,res){

    const idVideo= req.params.idVideo
    MaterialApoyoconst.MaterialesApoyo.find({idVideo:idVideo},(err, data)=>{
        if(err){
            console.log(err)
            res.status(400).send({err:'error en la busqueda de los recurso (archivos)'})
        }
        if(data){
            console.log(data)
            res.status(200).send(data)
        }
    })
}


function showLinks(req,res){

    const idVideo = req.params.idVideo;

    MaterialApoyoconst.links.find({idVideo:idVideo},(err, data)=>{
        if(err){
            console.log(err)
            res.status(200).send(err)
        }
        
        if(data){
            console.log(data)
            res.status(200).send(data)
        }
    })

}



module.exports={
    MaterialApoyo,
    Links,
    showMaterialapoyo,
    showLinks
}