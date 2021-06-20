const http=require('http')
const express=require('express')

const bodyParser=require('body-parser')
const cors=require('cors')

const app=express()

app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('Hello World ..!!!')
})

const {Server} =require('socket.io')
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:'*'
    }
})

const Room=require('./room')

const socketToPeerHashMap={} 

io.on('connect',(socket)=>{
    socket.emit('get:peerId')
    console.log('connected')

    socket.on('send:peerId',(peerId)=>{
        //console.log('lets see if it is set--',peerId)
        socketToPeerHashMap[socket.id]=peerId
    }) 
    //console.log('hellll')

    socket.on('send-message',(message,roomId)=>{
        console.log(message)
        socket.broadcast.emit('recieve-message',message,roomId)
    })

    socket.on('disconnect',()=>{
        console.log('disconnect')
        const peerId=socketToPeerHashMap[socket.id]
        console.log(peerId)
        io.emit("user:left",peerId)
    })
      
})

const rooms=[] 

app.post('/rooms',(req,res)=>{
    const newRoom=new Room(req.body.author)
    rooms.push(newRoom)
    res.json({
        roomId:newRoom.roomId
    })
})

app.get('/rooms/:roomId',(req,res)=>{
    const room =rooms.find((existingRoom)=>existingRoom.roomId===req.params.roomId)
    res.json({...room})
})

app.post('/rooms/:roomId/join',(req,res)=>{
    const room =rooms.find((existingRoom)=>existingRoom.roomId===req.params.roomId)
    room.addParticipants(req.body.participant);
    //console.log(req.body.participant)
    res.json({...room})
})


const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log("server is live ")
})

