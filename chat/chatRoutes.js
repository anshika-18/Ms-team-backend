const Message=require('./chatSchema')

module.exports=(app)=>{

    app.post('/newMess',(req,res)=>{
        const {roomId,name,mess,email}=req.body;
        Message.findOne({roomId})
            .then(data=>{
                if(data)
                {
                    data.message.push({
                        email,
                        name,
                        mess
                    })
                    
                    data.save()
                        .then(success=>{
                            return res.json(success)
                        })
                        .catch(err=>{
                            return res.status(400).json(err)
                        })
                }
                else
                {
                    const newChat=new Message({
                        roomId,
                        message:[
                            {
                                email,
                                name,
                                mess
                            }
                        ]
                    })
                    newChat.save()
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

    })

    app.get('/allMess/:roomId',(req,res)=>{
        const {roomId}=req.params
        Message.findOne({roomId})
            .then(result=>{
                return res.json(result);
            })
            .catch(err=>{
                console.log(err)
                return res.json(err)
            })
    })

}