'use strict'

const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.99.100:27017/cursosDB', {useNewUrlParser: true,'useFindAndModify': false},(err, res)=>{
    if(err) throw err;
    console.log('Conexion a la base de datos establecida');

})

module.exports = mongoose;
