'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatar = Schema({
   
    idUser:String,
    originalname:String,
    filename:String,
    Physicalpath:String,
    relativepath:String,
    linkfile:String,
    size:Number 
});

module.exports = mongoose.model('avatars',avatar);