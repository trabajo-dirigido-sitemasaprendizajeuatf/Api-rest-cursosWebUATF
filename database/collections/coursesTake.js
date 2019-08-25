'use strict'

const mongoose = require('mongoose');
const Schema= mongoose.Schema;

// esquema que almacena los examenes resueltos de los estuiantes de cada video
const CourseTakes = new Schema({
    idCourse:String,
    idSeccion:String,
    idVideo:String,
    idUser:String,
    notas:Array,      //lamacenara las notas  de los examenes de un video.
    fecha:{type:Date, default:Date.now()}

})


// esquema que almacena si un examen ya fue resuelto (si fue resuelto este ya no sera mostrado.)
const takesExamControl = Schema({
    idVideo:String,
    idUser:String,
    idExamen:String,
    timeShowExam:Number,
    examenResuelto:Boolean

})




var coursetake = mongoose.model('coursetakeexam',CourseTakes);
var userExamenSol = mongoose.model('TakeExamControl', takesExamControl);

module.exports={
    coursetake:coursetake,
    userexamsol:userExamenSol
}
