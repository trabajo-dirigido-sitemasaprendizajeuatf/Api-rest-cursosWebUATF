'use strict'

const mongoose = require('mongoose');
const connect = require('../../../database/collections/connect');
const User = require('../../../database/collections/user');
const userCtrl = require('../../../controllers/user');
const auth = require('../../../middlewares/auth');
const listUser = require('./listUser');
const searchUser=require('./searchUser');
const upload = require('./upladFile')
const sha1=require('sha1')
const curso=require('./crearCurso')
const ViewCourseForId = require('./crearCurso')
const unploadimg=require('./upladFile')
const UploadMaterialApoyo=require('./uploadMaterialApoyo')
const Ratings = require('./rating')
const CourseTake = require('./courseTake')
const MiscursosUser = require('./misCursosUser')
const ChatForumVideo = require('./chatForumVideo')
const Notas = require('./notas')

const EditUserData = require('./editUserData')

// backups
const Backups = require('./backup') 

const express = require('express');
const route = express.Router();

route.get('/',(req, res, next)=>{
    res.send({ messaje:'SERVICIO API-REST-FULL CORRIENDO '})
})   

// metodos de peticion GET, POST, UPDATE, DELETE-----------------

//lognup user
route.post('/signup', userCtrl.signUp)

//lognin user
route.post('/signin', userCtrl.signIn, (req, res)=>{
    res.status(200).send({message:'ok'})
})
 
//token middleware  (prueba)
route.get('/private', auth ,(req, res)=>{
    
     res.status(200).send({message:'Tines acceso'})
})

//listar usuarir
route.get('/users', listUser.listUser )
  //listar un usuario por id
route.get('/user/id=:idUser',listUser.listUserId)

//searUser muestra al usuario que se logue en el navegador
route.post('/userInterface',searchUser.searhcUnser,(req,res)=>{
    
})

// verificar el token
route.post('/verificaToken', userCtrl.verificarToken, (req, res)=>{

})
// :::::::::::::::::CURSOSO::::::::::::::::::::::::::
//crear crear cursos -- docente
route.post('/crearcurso',auth,curso.crearcurso,(req, res)=>{

})
// crear las seccion del curso
route.post('/seccion',curso.Createseccion,(req, res)=>{

})

// subir los videos correspondientes a cada seccion.
// http://localhost:3005/uploadvideo/idSeccion=5ced54dba8f9443ac069963f
route.post('/uploadvideo/idSeccion=:id/title=:title',curso.UploadVideo,(req, res)=>{

})

//listar los cursos creados por un solo maestro
route.get('/listcoursesforteacher/idcourse=:idcourse',curso.mostrarCursoporTeacher,(req, res)=>{

})

//listar todos los cursos
route.get('/listarcursos',curso.listarcursos,(req,res)=>{

})

// listar las secciones(contenido de cada curso) de los curso
route.get('/listarsecciones/idcourse=:idcourse',curso.motrarseccioncurso,(req, res)=>{

})

// muestra un solo curso por medio del id
route.get('/mostrarcursoforid/:idcourse',ViewCourseForId.mostrarUnCursoPorId,(req,res)=>{

})

// mostrar los datos de una clase (video de una seccion)
route.post('/show/data/video/class',curso.dataVideoSeccion)


//subir archivos --upload-file -- uri para subir arhivos en este caso videos MP4,etc
route.post('/uploadfile',upload.uploadFile,(req,res)=>{

})


// subir archicos de tipo imagen (poster)
 route.post('/uploadimg/idcourse=:idcourse', unploadimg.uploadFile,(req,res)=>{

})


// repasos el los videos
route.post('/cuestionariorepaso',curso.CrearRepaso,(req, res)=>{

})

route.post('/take/exam/student', curso.takeExam, (req, res)=>{

})


// material de apoyo del video (archivos)

route.post('/Upload/file/Materia/Apoyo/idVideo=:idVideo/filename=:filename',UploadMaterialApoyo.MaterialApoyo)

// material de apoyo Links
route.post('/Upload/links', UploadMaterialApoyo.Links)


// monstar los recurso

route.get('/Show/file/Materia/Apoyo/idVideo=:idVideo', UploadMaterialApoyo.showMaterialapoyo)

route.get('/Show/materialapoyo/links/idVideo=:idVideo', UploadMaterialApoyo.showLinks)


//  Star ratings  (calificiones con estrella)

route.post('/rating/star',(Ratings.ratings))

route.post('/avarage/rating/start',Ratings.avarage)     //--> obtine el promedio de los voto de cada course
route.post('/reating/star/user',Ratings.verVotoUsesr)    //  -->

// cursos tomados- courseTake 
route.post('/courses/takes/exam',CourseTake.courseTake)

route.post('/courses/examen/resolved', CourseTake.checkExamResolved)
route.post('/view/exam/student/course',CourseTake.mostarNotasStudent)   //--> muestra las notas de un estudinte


// --agrega los cursos que tomo o que agrego un estudiante 

route.post('/add/course/student',MiscursosUser.MisCursosUser)
    //mostrar los cursos de un usuario (mis cursos)
route.post('/show/my/courses/student',MiscursosUser.MostrarMisCursosUser)


// ---chatForum videos ----
route.post('/chat/forum/video',ChatForumVideo.savechatForum)   //no habilitado --> por el seriodr de socket.io esta en app.js
    //1) muestra en un array de aobetos todos las preguntas del chat.forum de un video
route.post('/show/chat/forum/video',ChatForumVideo.mostraChatForum)



// -----muestra las notas por curso para instructorio
route.post('/show/notas/students/course' , Notas.mostrarNotasDeUnCurso)

  // datos de un estudiante
route.post('/show/data/stundent/for/course',Notas.ViewDataStudent)

// muestra las notas de cada estudiante
route.post('/show/notas/student', Notas.showNotasStudent)
// muestra los estudinates de un cursos o cursos de un instructo
route.post('/show/students/courses', Notas.showStudentCourse)



//::::::::reportes de las notas en excel (un docente tiene varios cursos el reporte muestra las notas perenecientes a esos cursos)
route.post('/teacher/reports/notas', Notas.teacherReportsNotasCourse)


// -----EDITAR CUENTA USUARIO (avatar, name, lastname, ru, email, etc..)
route.post('/edit/my/account/user/idUser=:idUser',EditUserData.uploadFileAvatar)  //upload foto user (avatar)
route.get('/Show/image/avatar/idUser=:idUser', EditUserData.showAvatarImage)                 // muestra la imagen de perfil del usuario
route.get('/edit/show/users/data/iduser=:iduser',EditUserData.showDataUser)   // muestra los datos del usuario
route.put('/edit/my/account/user/data', EditUserData.UpdateDataUser )         // recibe los datos que seran actualizados
route.put('/security/update/email/ci/user', EditUserData.updateSegurityEmailCI)   // recibe el mail o ci que sera actualizado (seguridad)
route.put('/security/update/password/clavem',EditUserData.updatePassowrdClaveM)   // recibe el el password o clave M. para ser actualizados
// -----


// ADMIN
const Admin = require('./admin');

route.get('/admin/show/students', Admin.showUserStudents)
route.get('/admin/show/teachers', Admin.showTeachers)
route.put('/admin/update/role/user', Admin.updateRole)
route.get('/admin/show/all/asistants', Admin.showAssistants)


//generar archivos execel --> reportes
route.get('/admin/show/students/report', Admin.reportStudentAdmin)
route.get('/admin/show/teachers/report', Admin.reportsTeacherAdmin)
route.get('/admin/show/assistant/report', Admin.reportAssistantsAdmin)


// Backups
route.get('/backup', Backups.doBackup)
route.get('/showfiles', Backups.showFiles)




// busqueda de un usuario de acuerdo al nombre,inicia o parte del nombre
//   ert  --> valor que ingresa (puede ser una letra o palabra)

route.get("/user/search=:srt", (req, res, next) => {
    console.log(req.params)
    let search =req.params.srt

    User.find({name:new RegExp(search, 'i')}).exec( (error, docs) => {
      res.status(200).json(
        {
          info: docs
        }
      );
    })
});



//SHA1  ---> prueba
route.post('/sha1',(req,res)=>{
    console.log(req.body);

    const generatSha1=sha1(req.body.email)
    console.log(generatSha1);

    res.status(200).send({user:req.body}) 
    "5e3c27f996b7f266a6235a34416a59dd4fa0d64e" 
    "5e3c27f996b7f266a6235a34416a59dd4fa0d64e"
      
})





// :::::::::: upploadDataUserStudent in mongodb  ::::::::::
const uplad = require('../../../uploadDbUsers/upload')

route.get('/upload',uplad,(req, res)=>{

})
//:::::::::::::::::::::::end::::::::::::::::::::::::::::::

module.exports = route;