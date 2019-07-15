'use strict'

const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const examenVideo = ({
    idVideo:String,
    examen:Array,
    timeShowExamen:Number,  //tiempo en segundos (tiempo en que se mostrar los segundo)
    calificacion:Number,   

})

module.exports = mongoose.model('examenVideo',examenVideo)