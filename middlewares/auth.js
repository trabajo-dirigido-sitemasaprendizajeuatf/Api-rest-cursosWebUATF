'use strict'

 const generateToken = require('../token/generateToken')


function isAuth(req, res, next){
    console.log(req.headers.autorization);
    if(!req.headers.autorization){
        
        return res.status(403).send({message:'No tienes autorizacion'})
    }
    const token = req.headers.autorization.split(' ')[1]
    
    generateToken.decodeToken(token)
        .then(response=>{
            req.user = response
            console.log(req.user)
            next();
        })
        .catch(response=>{
            res.status(response.status)
            res.status(400).send({message:'El token a expirado'})
            return
        
        })
}

module.exports = isAuth;    