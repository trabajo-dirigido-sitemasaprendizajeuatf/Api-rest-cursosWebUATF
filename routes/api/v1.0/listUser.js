'use strict'
const User=require('../../../database/collections/user')


function listUser(req, res){
    var params = req.query;
    
    var skip = 0;
    if (params.skip != null) {
        skip = parseInt(params.skip) ;
    }
    var limit = 10;
    if (params.limit != null) {

        limit = parseInt(params.limit) ;
        
    }
    console.log(params);

    // http://localhost:3005/users?skip=2&limit=5     -->recibe en params skip y limit desde la url -->intervalo de resutados
    User.find({role:'student'}).skip(skip).limit(limit).exec((err, datos)=>{
        var users;
        // console.log(datos);
        
        users = datos.map((data,i)=>({
            _id:data._id,
            name:data.name,
            lastname:data.lastname,
            motherlastname:data.motherlastename,
            ci:data.ci, 
            phone:data.phone,
            email:data.email,
            curses:data.cursos,
            role:data.role,
           

        }))
        res.status(200).send({users:users})
    })
}

function listUserId(req,res){

    console.log(req.params)
    var idUser = req.params.idUser
    User.findById({_id:idUser}).exec()
        .then((doc)=>{
            res.status(200).send(doc)
        })
        .catch(err=>{
            res.status(400).send({err:'no se encontro el usuario'})
        })
}


module.exports = {
    listUser,
    listUserId
}

