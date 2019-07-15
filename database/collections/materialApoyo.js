'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MaterialApoyo = new Schema({
    idVideo:String,
    idUser:String,
    originalname:String,
    filename:String,
    Physicalpath:String,
    relativepath:String,
    linkfile:String,
    size:Number 
})


const Links = new Schema({
    idVideo:String,
    nameLink:String,
    link:String    
})




var materialApoyo = mongoose.model('materialsupport', MaterialApoyo)
var links= mongoose.model('links',Links)

module.exports={
    MaterialesApoyo:materialApoyo,
    links:links
}