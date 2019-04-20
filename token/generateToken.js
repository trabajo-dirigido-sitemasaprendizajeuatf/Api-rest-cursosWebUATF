'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

//function que crea el token-----
function createToken (user){
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp:moment().add(30, 'days').unix()
    }
    
    return jwt.encode(payload, config.SECRET_TOKEN)
}

//decodifica el token
function decodeToken(token){
    const decoded = new Promise((resolve, reject)=>{
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN)
            //console.log(payload)
            console.log(payload.exp-moment().unix())
            console.log(moment().unix())
            if(payload.exp <= moment().unix()){
                reject({
                    status:401,
                    message:'El token a exprirado'
                })
            }
            resolve(payload.sub)
        } catch (error) {
            reject({
                status:500,
                message: 'Invalid Token'
            })
        }
    })
    return decoded
}

module.exports = {
    createToken,
    decodeToken
}