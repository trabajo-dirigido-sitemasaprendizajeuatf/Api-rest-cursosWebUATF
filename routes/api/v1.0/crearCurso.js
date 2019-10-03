'use strict'

const Course = require('../../../database/collections/course')
const ExamenVideo = require('../../../database/collections/examenVideo')
const Rating = require('../../../database/collections/ratings')
// const Seccion = require('../../../database/collections/seccion')


//crear curso:::: un curso un tema o curso en que el curoso tiene varias seccion
// var idCourse
 function  crearcurso(req, res){


    var course= new Course.courses({
        idTeacher:req.body.idTeacher,
        namecourse:req.body.namecourse,
        sigla:req.body.sigla,
        lavel:req.body.lavel,
        title:req.body.title,
        autor:req.body.autor,
        seccion:req.body.seccion,
        descripcion: req.body.descripcion,
        posterCurso:'poster',
        video:[]
    })

    var dataCourse
     course.save((err,data)=>{
        if(err){
            console.log('error al guardar los datos')
            res.status()
        }

        if(data!=''){
            // console.log(data);
                    
                var objCourse={    //obejeto para el rating start 
                    idCourse:data._id
                }
                var rating=new Rating.rating(objCourse);
                rating.save();

            res.status(200).send(data)
            dataCourse= data;
            
        }
  
        // console.log(dataCourse);
        console.log(dataCourse);
        
        
    })
}


// crea el la seccion de los cursos  -->un curos tiene varias seccion y cada seccion hay vaioas videos
function Createseccion(req, res){

    // console.log(req.body.idCourse)
    const id =  req.body.idcurso;
    console.log(id);

    Course.courses.findById({_id:id}, (err,doc)=>{
        // console.log(doc)

        if(doc){
            var secc=new Course.seccions({
                idCourse:req.body.idcurso,
                seccion:req.body.seccion,
                titleSeccion:req.body.titleSeccion,
            })
            
            secc.save((err,data)=>{
                if(data){
                    console.log(data);
                    
                    res.status(200).send(data)
                }
                if(err){
                    console.log('error al crear la seccion del curso');
                    res.status(400).send({
                        message:'error',
                        err:'error al crear la seccion del curso'    
                    })

                }
            })
            
        }
        if(err){
            console.log('No se encontro el curso')
            res.status(400).send({
                message:'error',
                err:'No se encontro el curso'
            })
        }

        // res.status(200).send(doc)
    })

}

// ---------video--------------
const path=require('path')
const multer=require('multer')

const storage=multer.diskStorage({
    destination:"./public/video",
    filename:function(req,file,cb){
    var extencionArchivo=path.extname(file.originalname)
    console.log(extencionArchivo);
    cb(null,"VIDEO_"+Date.now()+extencionArchivo)
    }
})

var upload=multer({
    storage:storage
}).single("video")
//insertar los videos de cada seccion
function UploadVideo(req,res){

    var id=req.params.id
    var title=req.params.title
    
    console.log(req.params.id);
    
    upload(req,res, (err)=>{
        var titleVideo= req.params.title
        if(err){
            res.status(500).json({

            })
        }else{
            var ruta = req.file.path.substr(6,req.file.path.length);
            console.log(ruta);

            var filedata = {
                originalname:req.file.originalname,
                filename: req.file.filename,
                Physicalpath: req.file.path,
                relativepath: 'http://localhost:3005',
                linkfile:'http://localhost:3005'+ruta,
                size: req.file.size
            }

            
            var data = new Course.videos(filedata);
            var idvideo;
            data.save().then((infvideo)=>{
                console.log(infvideo);
                idvideo=infvideo._id;
                var seccion={
                    video:new Array()
                }

                Course.seccions.findById({_id:id},(err2,doc)=>{
                    console.log(doc);
                    var data=doc.video;
                    var aux=new Array();
                    if(data.length==1 && data[0]==""){
                        seccion.video.push({
                            idVideo:filedata._id,
                            linkfile:filedata.linkfile,
                            title:titleVideo
                            
                        })

                    }else{
                        aux.push({
                            idVideo:infvideo._id,
                            linkfile:infvideo.linkfile,
                            title:titleVideo
                        })
                        data=data.concat(aux);
                        seccion.video=data;
                    }

                    console.log(data,'---------');
                    Course.seccions.findOneAndUpdate({_id:id},seccion,(err3,doc)=>{
                        if(err3){
                            res.status(500).send({
                                message:'error a guardar el video de la seccion'
                            })
                            return;
                        }
                        if(doc){
                            // res.status(200).send(doc)
                            Course.videos.findById({_id:idvideo},(err4,doc4)=>{
                                if(err4){
                                    res.status(500).send({
                                        message:'err en la busqueda'
                                    })
                                    return;
                                }
                                if(doc4){
                                    res.status(200).send(doc4)
                                }
                            })
                            
                            // console.log(doc);
                            
                        }
                        
                    })
                    
                })
            })

           
            // console.log(filedata);
            // res.status(200).send(filedata);
            
        }
    })
}


//mostrar los curos

function listarcursos(req, res){
    var id=req.body.idcurso

    Course.courses.find({},(err,cursos)=>{
        if(cursos){
            console.log(cursos);
            res.status(200).send(cursos)
        }
        if(err){
            console.log('no existe ningun curos');
            res.status(400).send({
                message:'err',
                err:'no existe ningun curos'
            })
            
        }
    })

}


// muestra los datos de un video title --> en la cual esta el titulo de clase
async function dataVideoSeccion(req, res){
    
    const IDCOURSE = req.body.idCourse;
    const IDVIDEO = req.body.idVideo;

    try {

        const objSeccion= await Course.seccions.find({idCourse:IDCOURSE}).exec()
        if(objSeccion.length==0){
            throw new  Error('no seccion')
        }
        console.log(objSeccion.length)
        
        var aux = []
        for(var i=0; i<objSeccion.length; i++){
            aux.push(objSeccion[i].video)
            // console.log(aux[0])
        }
        
        var delta=[];
        aux.map((d,i)=>{
            d.map((d2,i2)=>{
                if(d2.idVideo==IDVIDEO){
                    console.log(d2)
                    delta.push(d2)

                }
            })
        })
    
        if(delta.length===0){
            throw new Error('no clase')
        }
        
         res.send(delta)

    } catch (error) {
        
        if(error.message==='no seccion'){
            res.status(400).send({message:'seccion no encontrado'})
        }
        if(error.message === 'no clase'){
            res.status(400).send({message:'clase no encontrado'})
        }
    }

}



//mostrar el contenido de cada curso todas las secciones de un curos.
function motrarseccioncurso(req, res){
    
    var id=req.params.idcourse
    // console.log(id);
    
    // console.log('peticion mostrar secciones del curso')

    Course.seccions.find({idCourse:id},(err,docs)=>{
        if(id==''){  res.status(400).send({message:'se require un id del curso'})}

        if(docs){
            console.log(docs)
            res.status(200).send(docs)
        }
        if(err){
            console.log('error busqueda de las secciones del curos');
            res.status(400).send({
                message:'error',
                err:'secciones del curso no encontrados'
            })
            
        }
    })

}
// muestra los cursos pertenecientes a un teacher
function mostrarCursoporTeacher(req,res){

    var idCourse=req.params.idcourse
console.log(req.params.idcourse);


    Course.courses.find({idTeacher:idCourse},(err, data)=>{
        if(data){
            res.status(200).send(data);
            console.log(data);
            
        }
        if(err){
            res.status(400).send({
                message:'err',
                err:'no se encostro ningun curso '
            })
        }
    })
}

function mostrarUnCursoPorId(req,res){

    var idcourse=req.params.idcourse

    Course.courses.findById({_id:idcourse},(err,data)=>{
        console.log(data)
        if(data){
            res.status(200).send(data)
        }
        if(err){
            res.status(400).send({message:'no se encontro el curso'})
        }
    })

}




// examenes o repados que se añadiran al video-----------
function CrearRepaso(req,res){

    console.log(req.body)

//   { idVideo: '5d23c5126fa6352b586c2394',
//   examen: { preguntas: [ [Object], [Object], [Object] ] },
//   showTimeExam: '71' }

    console.log(req.body.idVideo)

    var idVideo = req.body.idVideo;
    var examen = req.body.examen.preguntas;
    var timeShowExamen = req.body.showTimeExam;

    
    const examenVideo= new ExamenVideo({
        examen:examen,
        idVideo:idVideo,
        timeShowExamen:timeShowExamen
    })

    examenVideo.save((err, data)=>{
        if(err){
            console.log(err)
            res.status(400).send({err:'error al guardar las preguntas del examen'})
        }
        if(data){
            console.log(data)
            res.status(200).send(data)
        }
    })

    // res.status(200).send(req.body)  
    
}


// tomar el examen (exam student)

function takeExam(req, res){

    const idVideo = req.body.idVideo;
    const idUser = req.body.idUser;
    
    ExamenVideo.find({idVideo:idVideo})
        .then((doc)=>{
            console.log(doc)
            res.status(200).send(doc)
        })
        .catch((err)=>{
            console.log(err)
            res.status(400).send(err)
        })

}

module.exports={
 crearcurso,
 Createseccion,
 listarcursos,
 motrarseccioncurso,
 dataVideoSeccion,
 mostrarCursoporTeacher,  
 mostrarUnCursoPorId,
 CrearRepaso,
 takeExam,
 UploadVideo
}
