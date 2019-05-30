'use strict'

const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const bodyParser=require('body-parser');


const app = express();
const port = process.env.PORT || 3005;

const services= require('./routes/api/v1.0/services');
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//services api-rest
app.use('/courses/api/v1.0/',services)
app.use('/',services);

app.use(express.static('public'))



//server listening
app.listen(port,()=>{
    console.log(`Api-rsetfull corriendo en el puerto:${port}`)
});


module.exports = app;

