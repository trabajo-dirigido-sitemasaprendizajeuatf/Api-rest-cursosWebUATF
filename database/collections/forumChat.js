'use strict'


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var moment = require('moment');
var now = moment();

const chatForumSchema = Schema({
    idVideo:String,
    idUser:String,
    name:String,
    lastname:String,
    motherlastname:String,
    likes:{type:Number,default:0},
    disLike:{type:Number, default:0},
    pregunta:String,
    respuestas:Array,
    date:{type:Date, default:Date.now()},
    time: {
        type: String, 
        default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
    time2:String
    
})




var chatForum = mongoose.model('forumchat',chatForumSchema);

module.exports={
    chatForun:chatForum
}
