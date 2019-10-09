'use strict'

const Course = require('../../../database/collections/course')
const MisCursos = require('../../../database/collections/UserMiscursos')

const User = require('../../../database/collections/user')
const CourseTakes = require('../../../database/collections/coursesTake')


// monstrar notas de todos los estudiantes de uno o varios cursos dictados por un docente(instructor)
async function mostrarNotasDeUnCurso(req, res){
    const IDTEACHER = req.body.idTeacher;
    console.log(req.body)

    try {
        const misCursos = await Course.courses.find({idTeacher:IDTEACHER}).exec()
       
        if(misCursos.length===0){
            throw new Error('no tiene cursos')
        }

        console.log(misCursos[0]._id)

        var userStudent = []
        for(var i=0;i<misCursos.length;i++){

            console.log(i)
            const users =  await MisCursos.misCursosUser.find({idCourse:misCursos[i]._id}).exec()
            console.log(users)
            if(users.length!=0)
                userStudent.push(users)
        }

        console.log(userStudent)
        if(userStudent.length===0){
            throw new Error('no tiene estudiantes')
        }

        // console.log(users)
        res.send(userStudent)

    } catch (error) {
        if(error.message==='no tiene cursos'){
            console.log({idTeacher:IDTEACHER,message:`no tiene cursos`})
            res.status(400).send({message:'no tiene cursos'})
        }

        if(error.message==='no tiene estudiantes'){
            console.log({idTeacher:IDTEACHER,message:`no tiene estudiantes en sus cursos`})
            res.status(400).send({message:'no tiene estudiantes'})

        }
    }
   
}


// muestra los datos de una estudiante(name, lastname, ci, ru etc..)
async function ViewDataStudent(req, res){

    const idStudent=req.body.idUser;
console.log(idStudent)
    if(idStudent){

         await User.findById({_id:idStudent}).exec()
                .then(doc=>{
                    res.send(doc)
                })
                .catch(err=>{
                    res.status(400).send({message:'user no fount'})
                })
    
        
    }else{
        res.send({messge:'id user is requiered'})
    }
}


// funcion que mesuta las notas de un estudiante
async function showNotasStudent(req, res){

    const IDUSER = req.body.idUser
    const IDCOURSE = req.body.idCourse

    try {
        
    
    const coursesTakeStudent = await CourseTakes.coursetake.find({idUser:IDUSER}).exec()
    // console.log(coursesTakeStudent)
    console.log(coursesTakeStudent.length)

    var aux=[]
    console.log(typeof(IDCOURSE))
    for (var i = 0; i < coursesTakeStudent.length; i++) {
        console.log(typeof(coursesTakeStudent[i].idCourse))

        if(coursesTakeStudent[i].idCourse===IDCOURSE){
            console.log(coursesTakeStudent[i])
            aux.push(coursesTakeStudent[i])
        }
        
    }

    var nota=0
    for (let d = 0; d < aux.length; d++) {
        for (let e = 0; e < aux[d].notas.length; e++) {
            nota=nota+aux[d].notas[e].nota
        }
    }

    console.log(aux)
    console.log(nota)
    res.status(200).send({nota})

    } catch (error) {
            
    }
}


// funcion que muestra todos los estudinates de un curso 

async function showStudentCourse(req, res){

    const idTeacher = req.body.idTeacher;
    const idCourse = req.body.idCourse;

    const couresTeacher = await Course.courses.find({idTeacher:idTeacher}).exec()

    var aux=[]
    for (let i = 0; i < couresTeacher.length; i++) {
        console.log(couresTeacher[i]._id)

      const users = await MisCursos.misCursosUser.find({idCourse:couresTeacher[i]._id}).exec()
      aux.push(users)
    }
    console.log(couresTeacher)
    res.send(aux)


}


module.exports = {
    mostrarNotasDeUnCurso:mostrarNotasDeUnCurso,
    ViewDataStudent:ViewDataStudent,
    showNotasStudent:showNotasStudent,
    showStudentCourse:showStudentCourse
}
