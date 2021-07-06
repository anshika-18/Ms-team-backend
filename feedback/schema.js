const mongoose=require('mongoose')
const Schema=mongoose.Schema

const feedbackSchema=new Schema({
        email:{
                type:String
        },
        rating:{
                type:String
        }
})

module.exports=mongoose.model('feedback',feedbackSchema)