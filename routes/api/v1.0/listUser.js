'use strict'
const User=require('../../../database/collections/user')


function listUser(req, res){
    
    User.find({role:'student'},(err, datos)=>{
        var users;

        users = datos.map(data=>({
            _id:data._id,
            name:data.name,
            lastname:data.lastname,
            motherlastname:data.motherlastename,
            ci:data.ci, 
            phone:data.phone,
            email:data.email,
            curses:data.cursos,
            role:data.role

        }))
        res.status(200).send({users:users})
    })
}


module.exports = {
    listUser
}