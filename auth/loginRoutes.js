require('dotenv').config()
const User=require('./userModel')
const bcrypt=require('bcryptjs')

module.exports=(app)=>{

    //login to ms-team
    app.post('/api/auth/login',(req,res)=>{
        console.log(req.body)
        const {email,password}=req.body
        if(!email||!password)
            return res.status(400).json({msg:"please enter all details..."})

        User.findOne({email})
            .then(user=>{
                if(!user)
                    return res.status(400).json({msg:"user does not exist.Please register before You login.."})

                //compare password wheater it is valid or not
                bcrypt.compare(password,user.password)
                    .then(isMatch=>{
                        if(!isMatch)
                            return  res.status(400).json({msg:"Invalid User"})
                        
                        return res.status(200).json({
                            user:{
                                id:user.id,
                                name:user.name,
                                email:user.email
                            }
                        })
                    })
                    .catch(err=>{
                        return res.status(500).json(err)
                    })
            })
            .catch(err=>{
                return res.status(500).json(err)
            })
    })
}
