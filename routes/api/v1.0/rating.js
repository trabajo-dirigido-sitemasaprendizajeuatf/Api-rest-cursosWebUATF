'use strict'

const Course = require('../../../database/collections/course')
const Rating = require('../../../database/collections/ratings')


// funcion que se encarga de guardar los rating star ( clasificaion de los cursos de acuerdo a los votod de las estrellas)
async function ratings(req,res){

    const idCourse = req.body.idCourse;
    const IDUSER = req.body.idUser;
    const VOTO = req.body.voto;

    

    
   await Rating.rating.findOne({idCourse:idCourse},(err1, doc)=>{
        if(err1){
            console.log(err1)
            res.status(400).send(err1)
        }

        var objvotos={
            idUser:req.body.idUser,
            idCourse:req.body.idCourse,
            voto:req.body.voto
        }

        var votos =  new Rating.votos(objvotos)

        var objUser;
        var ctr=doc.ratingStar.map((d,i)=>{
            if(d.idUser===IDUSER){
                console.log(d.idUser)
                objUser=d
            }
        })
        // console.log(objUser)

        if(objUser){
        
                console.log('el uasuario existe',doc)
                var indice;
                var v = doc.ratingStar.map((d,i)=>{
                    if(req.body.idUser===d.idUser){
                    
                        // console.log(d.idUser);
                        // console.log(d.voto)
                        // console.log(i)
                        indice=i
                 
                    }
                })

                var v2=doc.ratingStar;
                // console.log(v2)
                v2[indice].voto=parseInt(req.body.voto)
                // console.log(v2)
                
                // var aux=new Array();
                var ratings={ratingStar:new Array()}
        
                ratings.ratingStar=v2

                Rating.rating.findByIdAndUpdate({_id:doc.id},ratings,(err4,doc4)=>{
                    // console.log(doc4)
                    if(err4){console.log({err:'error en la actualizacion'})}

                    if(doc4){
                         // actilizar el voto en el schema votos
                        Rating.votos.findOne({idUser:IDUSER},(e,d)=>{
                            var idvoto=d._id;
                        
                            var voto=parseInt(req.body.voto)
                            // console.log(voto)
                            Rating.votos.findByIdAndUpdate({_id:idvoto},{voto:req.body.voto}, (e2,d2)=>{
                                console.log(d2)
                                
                            })
                        })

                        Rating.rating.findById({_id:doc4._id},(err5,doc5)=>{
                            res.status(200).send(doc5)
                        })
                    }
                })
                
               
                
            
                
            
            }else{
                console.log('el usuario no existe')

                
                votos.save().then((infodata)=>{
                    console.log(infodata)
                    var id=infodata._id;
                    var rating={
                        ratingStar:new Array()
                    }
                    var data=doc.ratingStar;
                    var aux=new Array();

                    if(data.length===0){
                            rating.ratingStar.push({
                            idCourse:infodata.idCourse,
                            idUser:infodata.idUser,
                            voto:infodata.voto
                        })
                    }else{
                        aux.push({
                            idCourse:infodata.idCourse,
                            idUser:infodata.idUser,
                            voto:infodata.voto
                        })
                        data=data.concat(aux)
                        rating.ratingStar=data;
                    }

                    Rating.rating.findByIdAndUpdate({_id:doc._id},{ratingStar:rating.ratingStar}, (err2,doc2)=>{
                        console.log(doc2)
                        Rating.rating.findById({_id:doc2._id},(err6,doc6)=>{
                            res.status(200).send(doc6)
                        })
                        
                    })
                    console.log(rating)
                })

                    }
        




    })


    // Rating.rating.findOne({idUser:idUser},(err,user)=>{
    //     if(err){
    //         res.status(400).send({messgae: 'err al realizar la calificacion'})
    //     }   
    //     if(user){


    //        console.log(user.idUser) 
    //        console.log('====================================');
    //        console.log(user.voto);
    //        console.log('====================================');

    //        Rating.rating.findByIdAndUpdate({_id:user.id},{voto:req.body.voto},(error, doc)=>{
    //            console.log('====================================');
    //            console.log(doc);
    //            console.log('====================================');
    //        })
    //         console.log('el usuario ya voto, se actuzlizara su voto')
    //         res.status(200).send({messga:'el usuario ya voto, se actuzlizara su voto'})

            

    //     }else{
    //         console.log('el suario no voto,  se creara su voto')
            
    //         rating.save((err,data)=>{
    //             if(err){
    //                 console.log(err)
    //                 // res.status(200).send(err)
    //             }
    //             if(data){
    //                 console.log(data)
    //                 // res.status(200).send(data)
    //             }
    //         })

    //         res.status(200).send({messga:'el usuario aun no ha votado'})
    //     }
    // })

    
};



// get avarage of rating start  (obiene el promedio de los votos de cada curso)    avarage--> promedio 
async function avarage(req, res){

    console.log('avarage of rating')

    var votos
   await Rating.rating.findOne({idCourse:req.body.idCourse},(err,data)=>{
       if(err){
           console.log('error en busqueda del promedio de votos')
       }

       
       if(data){
        votos=data
        var idCurso=req.body.idCourse
        // res.status(200).send(votos)
           var sumaVotos=0;
           var cantidadAlumnos=data.ratingStar.length;
           var promedio=0.0;
            data.ratingStar.map((d,i)=>{
    
                //console.log(d.voto)
                sumaVotos+=d.voto
            })
                    if(sumaVotos !==0 && cantidadAlumnos !==0){
                        promedio=(sumaVotos/cantidadAlumnos)
                        console.log(sumaVotos);
                        console.log(cantidadAlumnos)
                        console.log(promedio)
                        
                        var data2={
                            idCourse:idCurso,
                            cantidadAlumnos:cantidadAlumnos,
                            sumavotos:sumaVotos,
                            promedio:promedio
                        }
                        res.status(200).send(data2)
                    }else{
                        promedio=0;
                    
                        var data2={
                            idCourse:idCurso,
                            cantidadAlumnos:cantidadAlumnos,
                            sumavotos:sumaVotos,
                            promedio:promedio
                        }
                        res.status(200).send(data2)

                    }
                
       }
       else{
            console.log({err:'error el curso no existe'});
            res.status(200).send({err:'error el curso no existe'});
       }
    })
};

function verVotoUsesr(req, res){

    console.log(req.body)
    const IDCOURSE = req.body.idCourse;
    const IDUSER =  req.body.idUser;

    if(!IDCOURSE && !IDUSER){
        console.log('datos incompletos --> retings');
        res.status(400).send({message: 'datos incompletos, reatings'})
    }

    Rating.rating.findOne({idCourse:IDCOURSE}, (err,doc)=>{
        console.log(doc)
        if(err){
            console.log({err:err} 
        )}

        if(doc){
            const ReatingStar = doc.ratingStar;
            if(ReatingStar.length!=0){
                ReatingStar.map((d,i)=>{
                    if(IDUSER===d.idUser){
                        const votoUser={
                            idCourse:d.idCourse,
                            idUser: d.idUser,
                            voto:d.voto
                        }
                        res.status(200).send(votoUser)
                    }   
                })
            }else{
                res.status(400).send({
                    message:'El Usuario aun no tiene ningun voto',
                    voto:0
                })
            }
        }else{
            res.status(400).send({err:'el curso no existe'})
        }
    })

}


module.exports={
    ratings,
    avarage,
    verVotoUsesr
}