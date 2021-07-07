const mongoose=require('mongoose')
const Schema=mongoose.Schema

const chatSchema=new Schema({
    roomId:{
        type:String
    },
    message:[{
        email:{
            type:String
        },
        name:{
            type:String
        },
        mess:{
            type:String
        },
        time:{
            type:Date,
            default:mongoose.now()
        }
    }]
})

module.exports=mongoose.model('Message',chatSchema)