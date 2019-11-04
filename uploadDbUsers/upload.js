'use strict'

const mogoose = require('mongoose')
const sha1 =  require('sha1')
const User = require('../database/collections/user')
const DBestudiantes=require('./DBestudiantes.json')   //es el Json que contiene los datos de todos los estudiantes






 function updat(req, res){
    var con=0;
 DBestudiantes.map(u=>{
    // console.log(u.nombre +' '+ u.paterno +' '+u.materno+ ' '+u.ru)
   
     const user =new User({
        name: u.nombre,
        lastname:u.paterno,
        motherlastename:u.materno,
        phone:'',
        ci:u.ci,
        ru:u.ru,
        avatarImage:'',
        claveMatricula:u.clave,
        email:'',
        sha1EmailCI:sha1(u.ci),
        password: '',
        sha1PassowrdClaveM:sha1(u.clave),
    })
   
    // console.log(user);
    const ciup = sha1(u.ci)

    
     User.findOne({sha1EmailCI:ciup} ,(err,user2)=>{
        
        // console.log('dentro');
        
        if(!user2){
            console.log(con=con+1)
           user.save((err2)=>{
                if(err2){
                    console.log('Error al crear el usuario :'+u.ci);
                }
                
            });
        }else{
            console.log('existing user');
            console.log(con=con+1)
        }
    });
    // console.log('end----');
});

    res.status(200).send({update: `usuarios actualizados`})
}

module.exports = updat
