const Room=require('./roomSchema')
const Participant=require('./userSchema')

module.exports=(app)=>{

    app.post('/createRoom',(req,res)=>{
        const {email,roomId,roomname,name}=req.body
        const user=new Room({
            roomId,
            name:roomname,
            participants:[
                {
                    email
                }
            ]
        })
        user.save()
            .then(data=>{
                Participant.findOne({email})
                        .then((data)=>{
                            if(data)
                            {
                                data.rooms.push({
                                    roomId,
                                    name:roomname
                                })
                                data.save()
                                    .then((success)=>{
                                        return res.json(success)
                                    })
                                    .catch(err=>{
                                        return res.json(err)
                                    })
                            }
                            else
                            {
                                const newParti=new Participant({
                                    name,
                                    email,
                                    rooms:[
                                        {
                                            roomId,
                                            name:roomname
                                        }
                                    ]
                                })
                                newParti.save()
                                        .then(success=>{
                                            return res.json(success)
                                        })
                                        .catch(err=>{
                                            return res.json(err)
                                        })
                            }
                        })
                        .catch(err=>{
                            return res.json(err)
                        })
               // return res.status(200).json(data)
            })
            .catch(err=>{
                res.json(err)
            })
    })

    app.post('/join/newRoom',(req,res)=>{
        const {name,email,roomId}=req.body;
        Room.findOne({roomId})
            .then(room=>{
                const roomname=room.name
                Participant.findOne({email})
                    .then(user=>{
                        if(user)
                        {
                            user.rooms.push({
                                roomId,
                                name:roomname
                            })
                            user.save()
                                .then(data=>{
                                   //res.status(200).json(data)
                                    room.participants.push({
                                        email
                                    })
                                    room.save()
                                        .then(success=>{
                                            return res.status(200).json({
                                                data,
                                                success
                                            })
                                        })
                                        .catch(err=>{
                                            return res.status(400).json(err)
                                        })
                                })
                                .catch(err=>{
                                    return res.status(400).json(err)
                                })
                        }  
                        else
                        {
                            const data=new Participant({
                                name,
                                email,
                                rooms:[
                                    {
                                        roomId,
                                        name:roomname
                                    }
                                ]
                            })

                            data.save()
                                .then(participant=>{
                                    room.participants.push({
                                        email
                                    })
                                    room.save()
                                        .then(success=>{
                                            return res.status(200).json({
                                                participant,
                                                success
                                            })
                                        })
                                        .catch(err=>{
                                            return res.status(400).json(err)
                                        })
                                    return res.status(200).json(participant)
                                })
                                .catch(err=>{
                                    return res.status(500).json(err)
                                })
                        }
                    })
                    .catch(err=>{
                        return res.status(400).json(err)
                    })
            })
            .catch(err=>{
                return res.status(400).json({msg:"no room found"})
            })
    })

    app.get('/personDetails/:email',(req,res)=>{
        const {email}=req.params
        Participant.findOne({email})
                    .then(data=>{
                        return res.json(data)
                    })
                    .catch(err=>{
                        res.json(err)
                    })
    })

    app.get('/roomDetails/:roomId',(req,res)=>{
        const {roomId}=req.params
        Room.findOne({roomId}) 
            .then(data=>{
                return res.json(data)
            })
            .catch(err=>{
                res.json(err)
            })
    })
}