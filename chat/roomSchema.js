const mongoose=require('mongoose')
const Schema=mongoose.Schema

const roomSchema=new Schema({
    roomId:{
        type:String
    },
    name:{
        type:String
    },
    participants:[{
            email:{
                type:String
            }
    }]
})

module.exports=mongoose.model('Room',roomSchema)
