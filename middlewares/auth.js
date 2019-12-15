'use strict'

 const generateToken = require('../token/generateToken')
const User = require('../database/collections/user')

function isAuth(req, res, next){


    console.log('--------------aut teacher');

    console.log(req.headers.autorization);
    if(!req.headers.autorization){
        
        return res.status(403).send({message:'No tienes autorizacion'})
    }
    const token = req.headers.autorization.split(' ')[1]
    
    generateToken.decodeToken(token)
        .then(response=>{
            req.user = response
            console.log(response)

            User.findById({_id:response},(err, resul)=>{

                console.log(resul)
                if(resul.role==="teacher" || resul.role==="admin"){
                    next();
                    
                }else{

                    res.status(404).send({message:'No tines acceso'})
                }
            })

            // next();
        })
        .catch(response=>{
            res.status(response.status)
            res.status(400).send({message:'El token a expirado'})
            return
        
        })
}



module.exports = isAuth;    