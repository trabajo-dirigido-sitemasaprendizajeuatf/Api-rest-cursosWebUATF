'use strict'

var  backup = require('mongodb-backup')
var backup2 = require('backup-mongodb')

const fs = require('fs')

function doBackup(req, res){

    var dir = './public/backups'
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
   
    }else{
        console.log('existe')
    }

    var dbUri= 'mongodb://192.168.99.101:27017/cursosDB'
    new backup2(dbUri, dir).backup();
    res.status(200).send({respuest:'Backup sucesfull'})

    // backup({
    //     uri: 'mongodb://192.168.99.101:27017/cursosDB',
    //     stream:res,
    // })
    
}

function showFiles(req, res){
    
}

module.exports = {
    doBackup,
    showFiles
}