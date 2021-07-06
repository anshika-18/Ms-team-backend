const feedback=require('./schema')

module.exports=(app)=>{
        app.post('/feedback',(req,res)=>{
                const {email,rating}=req.body
                console.log(req.body)
                const newData=new feedback({
                        email,
                        rating
                })
                newData.save()
                        .then(user=>{
                                res.status(200).json(user)
                        })
                        .catch((err)=>{
                                res.status(400).json(err)
                        })
        })
}