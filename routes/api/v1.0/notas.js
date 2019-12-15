'use strict'

const Course = require('../../../database/collections/course')
const MisCursos = require('../../../database/collections/UserMiscursos')

const User = require('../../../database/collections/user')
const CourseTakes = require('../../../database/collections/coursesTake')

const xlsx = require('xlsx');
const fs = require('fs')

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
        // console.log(userStudent)
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


// funcion que muestra todos los estudinates de un curso  (no se implemento)

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


// ::::::: reportes de las notas de cada cursos de cada docente :::::::::

async function teacherReportsNotasCourse(req, res){

    const IDTEACHER = req.body.idTeacher;

    const misCourseTeacher = await Course.courses.find({idTeacher:IDTEACHER}).exec();

    // console.log(misCourseTeacher)

    var misStudents=[];
    var IDCOURSE=[]
    var nombreMateria=[]

    for (let i = 0; i < misCourseTeacher.length; i++) {
            
            var idCour=misCourseTeacher[i]._id
            IDCOURSE.push(String(idCour))
            nombreMateria.push(misCourseTeacher[i].namecourse)

            const UsersDeUnCourse =  await MisCursos.misCursosUser.find({idCourse:misCourseTeacher[i]._id}).exec()
             
            if(UsersDeUnCourse.length>0){
                misStudents.push(UsersDeUnCourse)
                
            }
    }



    var idsUsers =[]
    var users=[]
    var listOfStudents=[]
    for (let i = 0; i < misStudents.length; i++) {

        for (let j = 0; j < misStudents[i].length; j++) {
            idsUsers.push(misStudents[i][j].idUser)

             const dataAndNotaStudents = await User.findById({_id:misStudents[i][j].idUser}).exec();
             if(dataAndNotaStudents.length!=0){
                

                const coursesTakeStudent = await CourseTakes.coursetake.find({idUser:misStudents[i][j].idUser}).exec()
                // console.log(coursesTakeStudent)
                console.log(coursesTakeStudent.length)
            
                var aux=[]
                console.log(typeof(IDCOURSE))
                for (var f = 0; f < coursesTakeStudent.length; f++) {
                    console.log(typeof(coursesTakeStudent[f].idCourse))
            
                    if(coursesTakeStudent[f].idCourse===IDCOURSE[i]){
                        console.log(coursesTakeStudent[f])
                        aux.push(coursesTakeStudent[f])
                    }
                    
                }
                // console.log('------')
                // console.log(aux)
                // console.log('-----end ------')


                var nota=0
                for (let d = 0; d < aux.length; d++) {
                    for (let e = 0; e < aux[d].notas.length; e++) {
                        nota=nota+aux[d].notas[e].nota
                    }
                }
                // console.log('------')
                // console.log(nota)
                // console.log('-----end ------')
                var user={
                    Nombres:dataAndNotaStudents.name,
                    APaterno:dataAndNotaStudents.lastname,
                    AMaterno:dataAndNotaStudents.motherlastename,
                    celular:dataAndNotaStudents.phone,
                    CI:dataAndNotaStudents.ci,
                    RU:dataAndNotaStudents.ru,
                    Curso:misCourseTeacher[i].namecourse,
                    Nota:nota
                }

                users.push(user)
             }
        }
        
    }

    // console.log(users)
    // console.log(misStudents.length)
    // console.log(IDCOURSE)


    if(users.length!=0){


        var newWB = await xlsx.utils.book_new();
        var newWS = await xlsx.utils.json_to_sheet(users);
        xlsx.utils.book_append_sheet(newWB, newWS, "Estudiantes")
        

        var dir ='./public/reports';

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
       
        var name = "NOTASETUDENTS_"+Date.now()
        var cretae = await xlsx.writeFile(newWB, `./public/reports/${name}.xlsx`)

        var linkFile={
            reports:'NotasStudents',
            linkFile: `http://localhost:3005/reports/${name}.xlsx`,

        }

        res.status(200).send(linkFile)
    }

    // res.send(users)

}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::




module.exports = {
    mostrarNotasDeUnCurso:mostrarNotasDeUnCurso,
    ViewDataStudent:ViewDataStudent,
    showNotasStudent:showNotasStudent,
    showStudentCourse:showStudentCourse,

    // ::repirtes de notas en excel:
    teacherReportsNotasCourse
}
