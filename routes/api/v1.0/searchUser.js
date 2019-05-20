'use strict'

const User = require('../../../database/collections/user');

function searhcUnser(req, res){

    // console.log(req.body.id);
    
    const id = req.body.id;
    // console.log(id)
    // res.status(200).send(req.body.id)
    
    User.findById({_id:id},(err,user)=>{
        if(user){
            const resUser=({
                id:user._id,
                role:user.role,
                name:user.name,
                email:user.email
            })
            // console.log(resUser)
            res.status(200).send(resUser)
            
        }else{
            res.status(200).send({
                message:'error',
                user:' el usuario no encontrado'
            })
        }
    })
    

}



module.exports={

    searhcUnser
}