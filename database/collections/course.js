'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CuorseSchema = new Schema({
    idTeacher:String,
    namecourse:String,
    sigla:String,
    lavel:Number,
    title:String,
    posterCurso:String,
    autor:String,
    descripcion: String,
    seccionVideo:Array,
    avarageRetingStar:{type:Number, default:0},
    createDateCourse:{type:Date, default:Date.now()}
})

const seccion = new Schema({
    idCourse:String,
    seccion:Number,
    titleSeccion:String,
    video:Array,
    createDateSeccion:{type:Date, default:Date.now()}

})

const Videos = new Schema(
{
    idSeccion:String,
    originalname:String,
    filename:String,
    Physicalpath:String,
    relativepath:String,
    linkfile:String,
    poster:String,
    size:Number 
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




//exportando varios Schemas---------
// module.exports = mongoose.model('courses',CuorseSchema)
var courses= mongoose.model('courses',CuorseSchema)
var seccions= mongoose.model('seccions',seccion)
var videos = mongoose.model('videos',Videos)


module.exports={
    courses:courses,
    seccions:seccions,
    videos:videos
}
        
