

//funcion que conviente la primea letra de un String en Mayusculas
function  capitalceText(text){

    

            if(text === " ")return " "
        // console.log(text);
        
        var min=text.toLowerCase();
        console.log(min);
        
        var min2 = min.split(' ');
        console.log(min2);
        
    
        return min2.map( word=>{
            console.log(word,"_____",word[0]);
            let mayuscula = word[0].toUpperCase()
            
            return word.replace(word[0], mayuscula)
        
        }).join(' ')
    

    

}


module.exports = {
    capitalceText
}