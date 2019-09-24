'use strict'

const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const bodyParser=require('body-parser');

const http = require('http')   // conf for socket.io
const socketIo = require('socket.io')


const app = express();
const port = process.env.PORT || 3005;

const services= require('./routes/api/v1.0/services');
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//services api-rest
app.use('/courses/api/v1.0/',services)
app.use('/',services);

app.use(express.static('public'))



// --------------SERVER SOCKET.IO frourm chat-------------
const server = http.createServer(app)
const io = socketIo(server)

// const chatForumVideo = require('./routes/api/v1.0/chatForumVideo');
const ChatForum = require('./database/collections/forumChat')
const User = require('./database/collections/user')

io.on('connection',socket=>{
    console.log('socket connected :',socket.id)

    socket.on('message', message=>{

        console.log(message)
        User.findById({_id:message.idUser}).exec()
            .then(doc=>{
                console.log(doc)
                const objChatFrum = {
                    idVideo:message.idVideo,
                    idUser:message.idUser,
                    name:doc.name,
                    lastname:doc.lastname,
                    motherlastname:doc.motherlastname,
                    pregunta:message.preguntaForum,
                    time2:Date.now()
                }
    
                var michatForum = new ChatForum.chatForun(objChatFrum)
                
            
                michatForum.save().then((info)=>{
                    
                   socket.broadcast.emit('message',{
                        body:info,
                        from:socket.id.slice(8)
                    })
                    
                })
            })
       


    //  console.log(chatForumVideo.savechatForum(body))
    })

})

// ---------------end server socket.io furm chat------------------


//server listening
server.listen(port,()=>{
    console.log(`Api-rsetfull corriendo en el puerto:${port}`)
});


module.exports =  app;

