'use strict'


const User = require('../../../database/collections/user')


// funcion que muestr solo los estudinate

async function showUserStudents(req, res){
    
    const listUser = await User.find({role:'student'}).exec();

    if(listUser.length===0){
        res.send({message:'no hay estudiantes'})
    }

    if(listUser.length>0){
        res.send(listUser)
    }
}


// funcion que muestra todos los docentes o instructores
async function showTeachers(req, res){

    const listUser = await User.find({role:'teacher'}).exec();

    if(listUser.length===0){
        res.send({message:'no hay docentes'})
    }

    if(listUser.length>0){
        res.status(200).send(listUser)
    }
}



module.exports={
    showUserStudents,
    showTeachers
}