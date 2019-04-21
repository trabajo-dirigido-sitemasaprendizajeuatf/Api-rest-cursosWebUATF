'use strict'

//auth es un contralador de registro y autenticacion de usuarios en la api-rest

const mongoose = require('mongoose');
const User = require('../database/collections/user');
const generateToken = require('../token/generateToken');
const bcrypt = require('bcryptjs');

// signUp-------------
function signUp(req, res){
  

    const user = new User({
         name :req.body.name,
         lastname: req.body.lastname,
         phone: req.body.phone,
         email:req.body.email,
         //encriptando la contraceña
         password: bcrypt.hashSync(req.body.password,10) 
    })
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email:email},(err, user2)=>{
        if(!user2){
            
            user.save((err)=>{
        
                if(err){
                    console.log(err)
                    res.status(500).sed({message:`Error al crear el usuario: ${err}`})
                    
                }
        
                const gentoken = generateToken.createToken(user)
                console.log(gentoken)
                return res.status(200).send({token: generateToken.createToken(user)})
                
            })
        }else{
            res.status(400).send({message:'El correo ya se encuentra registrado'})
        }
        //console.log(user2)
    })

}

//signIn----------------
function signIn(req, res){
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    


    User.findOne({email:req.body.email}, (err, user)=>{
        if(err){
            return res.statud(500).send({message:err})
        } 
        if(!user){
            
            return res.status(404).send({ message:'Email o password incorrectos' })
        }
        //desencriptando y comprobando la existencia de la contraceña
        if(!bcrypt.compareSync(req.body.password,user.password)){
            return res.status(400).json({
                err: {
                    menssage: 'Email o password incorrectos'
                }
            });
        }
        req.user = user;
        res.status(200).send({
            message:'Te has logueado conrrectamente',
            token: generateToken.createToken(user)
            
        })
    })

}

module.exports = {
    signUp,
    signIn
}

