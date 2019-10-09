'use strict'
const CourseTake = require('../../../database/collections/coursesTake')
const UserMisCursos = require('../../../database/collections/UserMiscursos')


 
async function courseTake(req,res){
    // console.log(req.body)
    // res.send(req.body)
    const IDVIDEO=req.body.idVideo;
    const NOTA = req.body.notas
    const IDUSER = req.body.idUser;

    // si el usuario no esta logueado
    if(!IDUSER){
        return
    }

    var objcourseTake = {
        idVideo:req.body.idVideo,     //un video puede tener varios examenes pero tambien solo se mostrara 1 sola vez los examens
        idCourse:req.body.idCourse,
        idSeccion:req.body.idSeccion,
        idUser:req.body.idUser,
        
    }

    //# objeto que guarda los datos de los examenes ya resuetos   
    var objexamenSol = {
        idVideo:req.body.idVideo,
        idUser:req.body.idUser,
        idExamen:NOTA.idExamen,
        timeShowExam:NOTA.timeShowExam,
        examenResuelto:NOTA.examenResuelto
    }


    var courseTakaData = new CourseTake.coursetake(objcourseTake)

    var userExamnSol = new CourseTake.userexamsol(objexamenSol)

    await CourseTake.coursetake.find({idVideo:IDVIDEO},(err,docs)=>{
        
        console.log(docs)
        
       

        if(docs.length==0){console.log('true')}else{console.log('else')}
        // res.send({message:'llego'})
        // return

        if(docs.length==0){
            console.log('no existen docs, sea creado')
            courseTakaData.save().then((info)=>{
                var notas =  new Array();
                var data = info.notas;
                var aux = new Array();
                if(data.length == 0){
                    aux.push(NOTA)
                    data=data.concat(aux);
                    notas=data
                }

                CourseTake.coursetake.findOneAndUpdate({_id:info._id},{notas},(err,params)=>{
                    if(err){
                        res.status(500).send({message:"error el la actualizacion de nota"})
                        return
                    }

                    userExamnSol.save();

                    CourseTake.coursetake.findOne({_id:info._id})
                        .then((doc)=>{
                            console.log(doc)
                            res.status(200).send(doc)
                        })
                })
               return
            })
        }
        if(docs.length!=0){

            var objDocs = docs;
            var idUser1;
            var idVideo;
            var dataNotas;
            var idExamen;

            if(objDocs.length!=0){
                objDocs.map((d,i)=>{
                    console.log(d.idUser)
                    console.log(d.idVideo)
                    if(d.idUser==IDUSER){
                        idUser1=d.idUser;
                        idVideo=d.idVideo;
                        dataNotas=d.notas
                        idExamen=d._id
                        console.log('====================================');
                    console.log(d);
                    console.log('====================================');
                    }
                   
                    
                })
            }

            console.log('========llegada============================');
            console.log(IDUSER);
            console.log(typeof(idUser1))
            console.log(IDVIDEO)
            console.log('====================================');



            console.log('existe, se actulizaron los datos')

           if(IDUSER==idUser1){
                 // console.log(docs)
            var notas=new Array();
            var data = dataNotas;
            var aux = new Array();
            
            var idUser=idUser1
            console.log('elseeeeeeeeeeeeeee',NOTA)

            var existeExamen=true
            data.map((d,i)=>{
                    console.log(d.idExamen);
                    console.log(idUser)
                if(d.idExamen==NOTA.idExamen && idUser1==IDUSER){
                    console.log('IDS IGUALES -- el examen ya fue resuelto por el usuario --')
                    existeExamen=false;
                }
            })

            aux.push(NOTA)

            data=data.concat(aux);
            notas=data
            console.log(notas)
            
            if(existeExamen==true && idUser1==IDUSER){

                CourseTake.coursetake.findOneAndUpdate({_id:idExamen},{notas},(err,params)=>{
                    if(err){
                        res.status(500).send({message:"error el la actualizacion de nota"})
                        return
                    }

                    userExamnSol.save();

                    CourseTake.coursetake.findOne({idVideo:idVideo})
                        .then((doc)=>{
                            console.log(doc)
                            res.status(200).send(doc)
                        })
                })
               return
            }else{
                console.log(idUser1)
                console.log(idVideo)
                console.log('El examen solo se puede resolverla una sola vez')
                res.status(400).send({message:'el examen ya fue recuelto, solo se pude resolver 1 sola vez'})
                }
           }else{
               
     
            console.log('no existen docs, sea creado')
            courseTakaData.save().then((info)=>{
                var notas =  new Array();
                var data = info.notas;
                var aux = new Array();
                if(data.length == 0){
                    aux.push(NOTA)
                    data=data.concat(aux);
                    notas=data
                }

                CourseTake.coursetake.findOneAndUpdate({_id:info._id},{notas},(err,params)=>{
                    if(err){
                        res.status(500).send({message:"error el la actualizacion de nota"})
                        return
                    }

                    userExamnSol.save();

                    CourseTake.coursetake.findOne({_id:info._id})
                        .then((doc)=>{
                            console.log(doc)
                            res.status(200).send(doc)
                        })
                })
               return
            })
        }
            }
        
    })
}


// function what verifica si un examen ya fue resuelto 

function checkExamResolved(req, res){
    const IDVIDEO = req.body.idVideo;
    const IDUSER = req.body.idUser;

    CourseTake.userexamsol.find({idUser:IDUSER},(err,doc)=>{
        
        console.log(doc)
        var objViewExam=new Array()
        doc.map((d,i)=>{
            if(d.idVideo==IDVIDEO){
                console.log(d)
                objViewExam.push(d)
            }
        })
        res.send(objViewExam)
    })
}



// funcion que muestra las notas de un usuario (student) por curso
//////////////////////7
async function  mostarNotasStudent(req, res){

    const IDUSER = req.body.idUser;
    const IDCOURSE = req.body.idCourse;

    try {
            const cantidadCursos= await UserMisCursos.misCursosUser.find({idUser:IDUSER}).exec()

            if(cantidadCursos.length==0){
                throw new Error('no cursos')
            }

    
            var aux=[]
            var idCourses = []
        
            console.log('====================================');
            console.log(cantidadCursos)
            console.log('====================================');


            // for(var i=0; i<cantidadCursos.length; i++){

            const notas= await CourseTake.coursetake.find( {idUser:IDUSER}).exec()
            console.log(notas)
            console.log(i)
            console.log(cantidadCursos.length)
            // console.log(notas.length)

            if(notas.length==0){
                throw new Error('sin cursos')
            }

            console.log(notas)
            console.log(notas.length)
            for(var i=0; i<notas.length; i++){
                console.log(notas.length)
                console.log(i)
                    if(notas[i].idUser===IDUSER){
                        aux.push(notas[i])
                        
                        console.log(notas[i])
                        idCourses.push(notas[i].idCourse)
                    }
            }

            // }

            
            console.log('====================================');
            // console.log(aux)
            console.log('====================================');
            // console.log(idCourses)

            var onlyOneCourse=[];

            var len = idCourses.length;
            var i = -1;

            while (i++ < len) {
                var j = i + 1;

                for (; j < idCourses.length; ++j) {
                if (idCourses[i] === idCourses[j]) {
                   idCourses.splice(j--, 1);
                }
                }
            }

            
            console.log(idCourses);
            // console.log(onlyOneCourse)
            
            var a =[]
            var b=[]

            var len2 = idCourses.length;
            var i2 = -1;
            while(i2++ < len2){
                var j2=i2
                for (; j2 < aux.length; j2++) {
                    var l=j2-1
                    if(idCourses[i2] === aux[j2].idCourse){
                        a.push(aux[j2])
                    }
                    
                }
                
                if(a.length>0){

                    b.push(a)
                    a=[]
                }
            
            }
            

            console.log('==============bbb======================');
            // console.log(b);
            // console.log(b.length)
            console.log('=============end bb=======================');
            res.send(b)

           
    } catch (error) {
            if(error.message=='no cursos'){

                res.status(400).send({message:'no tiene cursos agregados'})
            }
            if(error.message=='sin cursos'){
                res.status(400).send({message:'no hay examenes'})
            }
            
            // res.status(400).send({message:'ERROR ENESPERADO',erro:error.message})
        // console.log(error)
    }
    
}





module.exports={
    courseTake:courseTake,
    checkExamResolved:checkExamResolved,
    mostarNotasStudent:mostarNotasStudent
}