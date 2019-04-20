'use strict'

const mongoose = require('mongoose');
const connect = require('../../../database/collections/connect');
const User = require('../../../database/collections/user');
const userCtrl = require('../../../controllers/user');
const auth = require('../../../middlewares/auth');

const express = require('express');
const route = express.Router();

route.get('/',(req, res, next)=>{
    res.send({ messaje:'SERVICIO API-REST-FULL CORRIENDO '})
})   

// metodos de peticion GET, POST, UPDATE, DELETE

route.post('/signup', userCtrl.signUp)


route.post('/signin', userCtrl.signIn, (req, res)=>{
    res.status(200).send({message:'ok'})
})
 
//token middleware
route.get('/private', auth ,(req, res)=>{
    
     res.status(200).send({message:'Tines acceso'})
})



module.exports = route;