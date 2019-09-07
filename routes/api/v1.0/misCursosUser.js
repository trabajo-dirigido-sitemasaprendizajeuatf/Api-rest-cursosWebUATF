'use Strict'

const MisCursosUser = require('../../../database/collections/UserMiscursos');
const Course = require('../../../database/collections/course')

async function Misursos(req, res){

    const IDUSER = req.body.idUser;
    const IDCOURSE = req.body.idCourse;

    const objMisCursos = {
        idCourse:req.body.idCourse,
        idSeccion:req.body.idSeccion,
        idUser:req.body.idUser
    }

    var miscursos = new MisCursosUser.misCursosUser(objMisCursos)


   await MisCursosUser.misCursosUser.find({idUser:IDUSER},(err,doc)=>{
    
                if(err){
                    console.log({error:err})
                    res.status(200).send({message:err})
                }

                if(doc.length==0){
                        miscursos.save().then((info)=>{
                            console.log(info)
                            res.status(200).send({ok:'Curso agregado exitosamente'})
                        })
                        return
                }

                if(doc.length!=0){
                    // console.log(doc)
                    
                    MisCursosUser.misCursosUser.find({idCourse:IDCOURSE},(err2,doc2)=>{

                            if(err2){
                                console.log({error:err2})
                                res.status(400).send({err:err2})
                            }

                            if(doc2.length!=0){
                                console.log('el curso ya fue agregado---')
                                console.log(doc2)
                                res.status(200).send({message:'El curso ya fue agregado'})
                            }
                            
                            if(doc2.length==0){
                                miscursos.save().then((info2)=>{
                                    console.log(info2)
                                    res.status(200).send({ok:'Curso agregado exitosamente'})
                                })
                                return
                            }
                    })
                }

    })

    // console.log(req.body)

}





// ---Mostrar los cursos agregados por un usuario---- (Mis cursos)
async function mostrarMisCursosUser(req, res){
 
    var IDUSER = req.body.idUser
    var IDCOURSE=req.body.idcourse

    await MisCursosUser.misCursosUser.find({idUser:IDUSER}, async (err,doc)=>{
            
            if(doc.length!=0){
                var aux=new Array()

               for(var i=0;i<doc.length;i++) {
                    var idCourse=doc[i].idCourse
                    console.log(idCourse)
                  var curso = await Course.courses.findById({_id:idCourse}).exec()
                 
                        aux.push(curso)
                        console.log(curso)
                    
                };
                
                res.status(200).send(aux)

            }
            
        })
}


module.exports={
    MisCursosUser:Misursos,
    MostrarMisCursosUser:mostrarMisCursosUser
}