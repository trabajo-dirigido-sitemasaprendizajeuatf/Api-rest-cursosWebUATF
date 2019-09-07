'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// cursos que el estudiante tomo o los agrego

const miscursos =Schema({
    idCourse:String,
    idSeccion:String,
    idUser:String,
    dateAdd:{type:Date ,default:Date.now()},
});





const misCursos = mongoose.model('miscursosstudent', miscursos);


module.exports={
    misCursosUser:misCursos
}
