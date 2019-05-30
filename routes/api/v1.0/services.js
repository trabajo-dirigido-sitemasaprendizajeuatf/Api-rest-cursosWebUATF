'use strict'

const mongoose = require('mongoose');
const connect = require('../../../database/collections/connect');
const User = require('../../../database/collections/user');
const userCtrl = require('../../../controllers/user');
const auth = require('../../../middlewares/auth');
const listUser = require('./listUser');
const searchUser=require('./searchUser');
const upload = require('./upladFile')
const sha1=require('sha1')
const curso=require('./crearCurso')

const express = require('express');
const route = express.Router();

route.get('/',(req, res, next)=>{
    res.send({ messaje:'SERVICIO API-REST-FULL CORRIENDO '})
})   

// metodos de peticion GET, POST, UPDATE, DELETE-----------------

//lognup user
route.post('/signup', userCtrl.signUp)

//lognin user
route.post('/signin', userCtrl.signIn, (req, res)=>{
    res.status(200).send({message:'ok'})
})
 
//token middleware  (prueba)
route.get('/private', auth ,(req, res)=>{
    
     res.status(200).send({message:'Tines acceso'})
})

//listar usuarir
route.get('/users', listUser.listUser )

//searUser muestra al usuario que se logue en el navegador
route.post('/userInterface',searchUser.searhcUnser,(req,res)=>{
    
})

// verificar el token
route.post('/verificaToken', userCtrl.verificarToken, (req, res)=>{

})
// :::::::::::::::::CURSOSO::::::::::::::::::::::::::
//crear crear cursos -- docente
route.post('/crearcurso',curso.crearcurso,(req, res)=>{

})
// crear las seccion del curso
route.post('/seccion',curso.Createseccion,(req, res)=>{

})

// subir los videos correspondientes a cada seccion.
// http://localhost:3005/uploadvideo/idSeccion=5ced54dba8f9443ac069963f
route.post('/uploadvideo/idSeccion=:id',curso.UploadVideo,(req, res)=>{

})

//listar los cursos
route.get('/listarcursos',curso.listarcursos,(req,res)=>{

})

// listar las secciones(contenido de cada curso) de los curso
route.get('/listarsecciones',curso.motrarseccioncurso,(req, res)=>{

})

//subir archivos --upload-file -- uri para subir arhivos en este caso videos MP4,etc
route.post('/uploadfile',upload.uploadFile,(req,res)=>{

})







//SHA1  ---> prueba
route.post('/sha1',(req,res)=>{
    console.log(req.body);

    const generatSha1=sha1(req.body.email)
    console.log(generatSha1);

    res.status(200).send({user:req.body}) 
    "5e3c27f996b7f266a6235a34416a59dd4fa0d64e" 
    "5e3c27f996b7f266a6235a34416a59dd4fa0d64e"
      
})

// :::::::::: upploadDataUserStudent in mongodb  ::::::::::
const uplad = require('../../../uploadDbUsers/upload')

route.get('/upload',uplad,(req, res)=>{

})
//:::::::::::::::::::::::end::::::::::::::::::::::::::::::

module.exports = route;