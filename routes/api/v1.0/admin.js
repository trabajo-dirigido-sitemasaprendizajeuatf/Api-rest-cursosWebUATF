'use strict'


const User = require('../../../database/collections/user')

const xlsx = require('xlsx')
const fs = require('fs')


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


// funcion que actualiza roles de los usuarios
function updateRole(req, res){

    const IDUSER = req.body.idUser;
    const NEWROLE = req.body.newRole;

    if(NEWROLE ==='student' || NEWROLE ==='teacher' || NEWROLE==='assistant' || NEWROLE==='admin' ){

    }else{
        res.status(400).send({message:'role type not accepted'})
        return
    }

    User.findById({_id:IDUSER},(err1,doc1)=>{

        if(err1){
            res.status(400).send({err:'id user no fount'})
        }
        if(doc1){

            User.findByIdAndUpdate({_id:IDUSER},{role:NEWROLE},(err,doc)=>{
                if(err){
                    res.status({err:'no update role'})
                    return
                }
        
                var ok={
                    _id:doc._id,
                    name:doc.name,
                    lastname: doc.lastname,
                    newRole:NEWROLE

                }
        
                res.status(200).send(ok)
            })
        }
        

    })
    

}


// funcion que muestra todos los auxiliares
async function showAssistants(req, res){

    const assistants = await User.find({role:'assistant'}).exec()
    if(assistants.length===0){
        res.status(400).send({message:'no hay auxiliares'})
    }

    if(assistants.length>0){
        res.status(200).send(assistants)
    }

}

//####----REPORTES----####
// ----1)function report students----
async function reportStudentAdmin(req, res){
    
    const listUser = await User.find({role:'student'}).exec();

    if(listUser.length===0){
        res.send({message:'no hay estudiantes'})
    }


    var obj = await listUser.map((d,i)=>{
        var users={
            Nombres:d.name,
            A_Paterno:d.lastname,
            A_Materno:d.motherlastename,
            Cel: d.phone,
            CI:d.ci,
            RU:d.ru,

        }
        return users
    })

    if(listUser.length>0){


        var newWB = await xlsx.utils.book_new();
        var newWS = await xlsx.utils.json_to_sheet(obj);
        xlsx.utils.book_append_sheet(newWB, newWS, "estudiantes")
        

        var dir ='./public/reports';

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
       
        var name = "STUDENTS_"+Date.now()
        var cretae = await xlsx.writeFile(newWB, `./public/reports/${name}.xlsx`)

        var linkFile={
            reports:'students',
            linkFile: `http://localhost:3005/reports/${name}.xlsx`,

        }

        res.status(200).send(linkFile)
    }
}


// --- 2) function crear reportes de docentes

async function reportsTeacherAdmin(req, res){

    const listTeacher = await User.find({role:'teacher'}).exec();

    if(listTeacher.length===0){
        res.send({message:'no hay docentes'})
    }

    if(listTeacher.length>0){

        // genrera el archivo excel

        var objTeacher = listTeacher.map((d,i)=>{
            var teacher={
                nombres:d.name,
                A_paterno:d.lastname,
                A_Materno:d.motherlastename,
                CI:d.ci,
                email:d.email,
                telefono:d.phone
            }
            return teacher
        })


        var newWB = xlsx.utils.book_new();
        var newWS = xlsx.utils.json_to_sheet(objTeacher);

        xlsx.utils.book_append_sheet(newWB,newWS,'docentes')

        var direccion='./public/reports/'

        if(!fs.existsSync(direccion)){
            fs.mkdirSync(direccion);
        }

        var namefile= "TEACHERS_"+Date.now();

        xlsx.writeFile(newWB, `./public/reports/${namefile}.xlsx`)


        var linkFile={
            report:'teachers',
            linkFile:`http://localhost:3005/reports/${namefile}.xlsx`
        }

        res.status(200).send(linkFile)
        
    }
}

// funcion que meustra un reporte de los auxiliares en en fromato excel

async function reportAssistantsAdmin(req, res){
    
    const listUser = await User.find({role:'assistant'}).exec();

    if(listUser.length===0){
        res.send({message:'no hay auxiliares'})
    }


    var obj = await listUser.map((d,i)=>{
        var users={
            Nombres:d.name,
            A_Paterno:d.lastname,
            A_Materno:d.motherlastename,
            Cel: d.phone,
            CI:d.ci,
            RU:d.ru,

        }
        return users
    })

    if(listUser.length>0){


        var newWB = await xlsx.utils.book_new();
        var newWS = await xlsx.utils.json_to_sheet(obj);
        xlsx.utils.book_append_sheet(newWB, newWS, "auxiliares")
        

        var dir ='./public/reports';

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
       
        var name = "ASSISTANTS_"+Date.now()
        var cretae = await xlsx.writeFile(newWB, `./public/reports/${name}.xlsx`)

        var linkFile={
            reports:'assistants',
            linkFile: `http://localhost:3005/reports/${name}.xlsx`,

        }

        res.status(200).send(linkFile)
    }
}



// *******REPORES END*******


module.exports={
    showUserStudents,
    showTeachers,
    updateRole,
    showAssistants,

    // reports
    reportStudentAdmin,
    reportsTeacherAdmin,
    reportAssistantsAdmin
}