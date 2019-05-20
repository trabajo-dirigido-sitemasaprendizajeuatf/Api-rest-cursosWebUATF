'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuorseSchema = new Schema({
    nameCourse:String,
    acronym:String,
    semester:String,
    lavel:Number,
    title:String,
    descripcion: String,
    video:[ ]
})

const Videos = new Schema(
{
        path: String,
        duration : Number,
        cuestionario:[],
        descripcion: String
});

const Cuestionario = new Schema(
{
            pregunta:String,
            respuesta:[]
});
    
const respuesta = new Schema(
{
                pregunta:String,
                respuesta:[]
});
        