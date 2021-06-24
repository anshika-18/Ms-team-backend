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
        socketToPeerHashMap[socket.id]=peerId;

    }) 
    
    socket.on('send-message',(message,roomId)=>{
        console.log(message)
        socket.broadcast.emit('recieve-message',message,roomId)
    })

    socket.on('stopping-screen-share',(roomId)=>{
        socket.broadcast.emit('stop-sharing',roomId)
    })


    socket.on('disconnect',()=>{ 
        console.log('disconnect')
        const peerId=socketToPeerHashMap[socket.id]
        console.log(peerId)
        io.emit("user:left",peerId)
    })
      
})

const rooms=[] 

mongoose.connect(process.env.MONGO_URL,{ useUnifiedTopology: true,useNewUrlParser:true })
        .then(()=>{
            console.log('database connected')
        })
        .catch(error=>{
            console.log(error)
        })

require('./auth/authRoutes')(app)

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
    console.log(req.body.participant)
    res.json({...room})
})

app.post('/api/send',(req,res)=>{

    let transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        service:'gmail',
        auth:{
            user:process.env.user,
            pass:process.env.pass
        }
    })
    //console.log(req.body)    

    var to=req.body.to.split(',');
    //console.log(to)

    for(var i=0;i<to.length;i++)
    {
        var options={
            to:to[i].trim(),
            subject:"Link for meeting",
            html:"<h3>Joining Link for meeting is </h3>"+"<h3 style='font-weight:bold'>"+req.body.url+"</h3>"
        }

        transporter.sendMail(options,(error,info)=>{
            if(error)
            {
                return console.log(error)
            }
            console.log('Message sent : %s',info.messageId);
            console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
            console.log('link sent')
        })
    }

    res.json('successfull')

})


app.post('/api/getname',(req,res)=>{
    console.log('getname - - ',req.body)
    const room =rooms.find((existingRoom)=>existingRoom.roomId===req.body.roomId)
    for(let i=0;i<room.participants.length;i++)
    {
        if(room.participants[i].id===req.body.id)
        {
            return res.json(room.participants[i].name)
        }
    }
})

const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log("server is live ")
})

