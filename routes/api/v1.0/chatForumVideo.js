'use strict'

const ChatForum = require('../../../database/collections/forumChat')
const User = require('../../../database/collections/user')

// guarda una pregunta de cada clase (video) -->forumchat 
async function savechatForum(objchat){

        const IDVIDEO = objchat.idVideo;
        const IDUSER = objchat.idUser;
        const pregunta = objchat.preguntaForum
        
       

   await   User.findById({_id:IDUSER}, (err,doc)=>{

        console.log(doc)
            if(doc){
                const objChatFrum={
                    idVideo:objchat.idVideo,
                    idUser:objchat.idUser,
                    name:doc.name,
                    lastname:doc.lastname,
                    motherlastname:doc.motherlastname,
                    pregunta:objchat.preguntaForum
                }
    
                // console.log(objChatFrum)
    
                var michatForum = new ChatForum.chatForun(objChatFrum)
        
                michatForum.save().then((info)=>{
                    // console.log(info)
                    
        
                    return info
                    
                })
            }
           
        })
                


        // return objchat
} 



// listra todos los chat-forum
async function mostraChatForum(req, res){

    const IDVIDEO = req.body.idVideo;

    var params = req.query;
    
    var skip = 0;
    if (params.skip != null) {
        skip = parseInt(params.skip) ;
    }
    var limit = 10;
    if (params.limit != null) {

        limit = parseInt(params.limit) ;
        
    }

    ChatForum.chatForun.find({idVideo:IDVIDEO}).sort({time2:'descending'}).skip(skip).limit(limit).exec((err, docs)=>{
        if(err){ 
            console.log({err:'error en la busqueda de preguntas en el forum de un video',err:err})
            res.status(400).send({err:'error en la busqyeda de chat en el forum',err:err})
        }
        if(docs.length==0){
            console.log({message:'Aun no hay preguntas'});
            res.status(200).send({message:'Aun no hay preguntas'})
        }
        if(docs.length>0){
            
            console.log(docs);
            // var aux =[];
            // for(var i=docs.length-1;i>=0;i--){
            //     aux.push(docs[i])
            // }
            // console.log(aux)
            res.status(200).send(docs)
        }
    })
   
}

module.exports={
    savechatForum,
    mostraChatForum
}