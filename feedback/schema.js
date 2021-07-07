const mongoose=require('mongoose')

const feedback=new mongoose.Schema({
        email:{
                type:String
        },
        rating:{
                type:String
        }
})

module.exports=mongoose.model('feedback',feedback)