const nodemailer=require('nodemailer')

module.exports=(app,rooms)=>{

    const Room=require('../room')

    app.get('/',(req,res)=>{
        res.send('Hello World ..!!!')
    })

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
        const { params, body } = req;
        const roomIndex = rooms.findIndex(existingRooms => existingRooms.roomId === params.roomId);
        let room = null;
        
        if (roomIndex > -1) {
            room = rooms[roomIndex]
            room.addParticipants(body.participant);
            rooms[roomIndex] = room
        }
        res.json({ ...room.getInfo() })
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
    
}