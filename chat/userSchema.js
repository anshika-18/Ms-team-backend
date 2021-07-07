const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
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
