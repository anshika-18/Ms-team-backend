require('dotenv').config()
const http=require('http')
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const nodemailer=require('nodemailer')
const app=express()
const mongoose=require('mongoose')
app.use(bodyParser.json())
app.use(cors())


const {Server} =require('socket.io')
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:'*'
    }
})


const MapPeerIdWithSocket={} 
const rooms=[] 

io.on('connect',(socket)=>{
    socket.emit('get:peerId')
    console.log('connected')

    socket.on('send:peerId',(peerId)=>{
        //console.log('lets see if it is set--',peerId)
        MapPeerIdWithSocket[socket.id]=peerId;

    }) 
    
    socket.on('send-message',(message,roomId,name)=>{
        console.log(message)
        socket.broadcast.emit('recieve-message',message,roomId,name)
    })

    socket.on('stopping-screen-share',(roomId)=>{
        socket.broadcast.emit('stop-sharing',roomId)
    })
 
    socket.on('raise-hand',(name,roomId)=>{
        console.log(name)
        socket.broadcast.emit('hand-raised',name,roomId)
    })

    socket.on('lower-hand',(name,roomId)=>{
        console.log(name)
        socket.broadcast.emit('hand-lowered',name,roomId)
    })

    socket.on('disconnect',()=>{ 
        //console.log('disconnect')
        const peerId=MapPeerIdWithSocket[socket.id]
        //console.log(peerId)
        io.emit("user:left",peerId)
        let roomIndex=-1;
        for(var i=0;i<rooms.length;i++)
        {
            let existingRoom=rooms[i]
            for(var j=0;j<existingRoom.participants.length;j++)
            {
                if(existingRoom.participants[j].id===peerId)
                {
                    roomIndex=i;
                }
            }
        }
        //console.log('room Index is - ',roomIndex)
            if (roomIndex > -1) {
                let room = rooms[roomIndex]
                room.removeParticipants(peerId);
                rooms[roomIndex] = room
            }
    })
      
})

//connect to mongoDb
mongoose.connect(process.env.MONGO_URL,{ useUnifiedTopology: true,useNewUrlParser:true })
    .then(()=>{
        console.log('database connected')
    })
    .catch(error=>{
        console.log(error)
})

//api's
require('./auth/authRoutes')(app)
require('./api/join')(app,rooms)

const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log("server is live ")
})

