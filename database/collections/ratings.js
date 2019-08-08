

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    idCourse:String,
    ratingStar:Array,    //se almacenaran todos votos de un curso (clasificacion de estrellas)
    date:{type:Date, default:Date.now()}
})


const votosSchema = new Schema({
    idCourse:String,
    idUser:String,
    voto:Number,
    ultimoVoto:{type:Date, default:Date.now()}
})


const promedioSchema = new Schema({
    idCourse:String,
    votos:Number,
    cantidad:Number,
    everage:Number
})




var rating = mongoose.model('rating',RatingSchema);
var promedio = mongoose.model('promedio', promedioSchema);
var votos = mongoose.model('votos', votosSchema)

module.exports={
    rating:rating, 
    promedio:promedio,
    votos:votos
}


