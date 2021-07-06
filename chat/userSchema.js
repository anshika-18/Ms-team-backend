const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    rooms:[{
        roomId:{
            type:String
        },
        name:{
            type:String
        }
    }]
})

module.exports=mongoose.model('Participant',userSchema);
