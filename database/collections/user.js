'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')


const UserSchema = Schema({
    name: String,
    lastname:String,
    motherlastename:String,
    phone:String,
    ci:String,
    ru:String,
    claveMatricula:String,
    email:String,
    sha1EmailCI:String,
    password: String,
    sha1PassowrdClaveM:String,
    role:{type:String,
        enum:['student','teacher','admin','assistant'],
        default:'student'   
    },
    cursos:Array,
    sigupDate:{type:Date, default:Date.now()},
    lastlogin:Date
})


// UserSchema.pre('save',(next)=>{
//     let user = this

//     bcrypt.genSalt(10,(err,salt)=>{
//         if(err) return next(err)

//         bcrypt.hash(user.password, salt, null,(err, hash)=>{
//             if(err) return next(err)

//             user.password = hash
//             next();
//         })
//     })
// })
 
module.exports = mongoose.model('User', UserSchema);    
