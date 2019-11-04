'use strict'
const sha1=require('sha1')
//auth es un contralador de registro y autenticacion de usuarios en la api-rest

const mongoose = require('mongoose');
const User = require('../database/collections/user');
const generateToken = require('../token/generateToken');
const bcrypt = require('bcryptjs');

const capitalceText= require('../routes/api/v1.0/capitaliceText')

// signUp-------------
function signUp(req, res){
//   capitalceText.capitalceText()

    const user = new User({
         name :capitalceText.capitalceText(req.body.name),
         lastname: capitalceText.capitalceText(req.body.lastname),
         motherlastename:'', 
         phone:req.body.phone,
         email:req.body.email,
         ci:'',
         ru:'',
         avatarImage:'',
         claveMatricula:'',
         sha1EmailCI:sha1(req.body.email),
         sha1PassowrdClaveM:sha1(req.body.password),
         //encriptando la contraceña
        //  password: bcrypt.hashSync(req.body.password,10) 
        password: req.body.password
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
    
// -------------
const reqsha1EmailCi = sha1(req.body.email)
const reqsha1passwordClaveM = sha1(req.body.password)
// console.log(reqsha1EmailCi);


    User.findOne({sha1EmailCI:reqsha1EmailCi}, (err, user)=>{
        if(err){
            return res.statud(500).send({message:err})
        } 
        if(!user){
            
            return res.status(404).send({ err:'Email o password incorrectos' })
        }
        //desencriptando y comprobando la existencia de la contraceña
        // if(!bcrypt.compareSync(req.body.password,user.password)){
            if(reqsha1passwordClaveM != user.sha1PassowrdClaveM){

            return res.status(400).json({
                err: {
                    message: 'Email o password incorrectos'
                }       
            });
        }
        req.user = user;
        res.status(200).send({
            message:'Te has logueado conrrectamente',
            token: generateToken.createToken(user),
            id:user._id,
            email:user.email,
            name:user.name,
            lastname:user.lastname,
            role:user.role

            
        })
    })

}

// verificar token
function verificarToken(req, res){
    console.log('VerificarToken--->');
    console.log(req.body.token);
    
    const resul = generateToken.decodeToken(req.body.token)
        .then(res=>{
            console.log(res)
        })
        .catch(res=>{
            console.log(res);
            
        })

    // User.findById()

    // console.log(resul)
    // res.status(200).send(req.body.token )
}


module.exports = {
    signUp,
    signIn,
    verificarToken
}

