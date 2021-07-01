require('dotenv').config()
const User=require('./userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

module.exports=(app)=>{
    
    //register to ms-team
    app.post('/api/auth/register',(req,res)=>{
        const {name,email,password}=req.body

        if(!name||!email||!password)
        {
            return res.status(400).json({msg:'Please enter all details ...'})
        }
        
        //find if user already registered
        User.findOne({email})
            .then(user=>{
                if(user)
                {
                    return res.status(400).json({msg:'user already exist. You can login to proceed..'})
                }
                else
                {
                    //check if username already taken
                    console.log(name)
                    User.findOne({name})
                        .then(username=>{
                            if(username)
                            {
                                return res.status(400).json({msg:'username already taken'})
                            }
                            else
                            {
                                const newUser=new User({
                                    name,
                                    email,
                                    password
                                })
            
                                //hash password before storing
                                bcrypt.genSalt(10,(err,salt)=>{
                                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                                        if(err) throw err;
            
                                        newUser.password=hash;
            
                                        //generate token
                                        newUser.save()
                                            .then(user=>{
                                                jwt.sign(
                                                    {id:user.id},
                                                    process.env.jwtSecret,
                                                    {expiresIn:7*3600},
                                                    (err,token)=>{
                                                    if(err) throw err;
                                                        res.json({
                                                            token,
                                                            user:{
                                                                id:user.id,
                                                                name:user.name,
                                                                email:user.email
                                                            }
                                                        })
                                                    }
                                                )
                                            })
                                            .catch(err=>{
                                                return res.status(500).json(err)
                                            })
                                    })
                                })
                            }
                        })
                    

                }
            })
            .catch(err=>{
                return res.status(500).json(err)
            })
        


    })

    //login to ms-team
    app.post('/api/auth/login',(req,res)=>{
        console.log(req.body)
        const {email,password}=req.body
        if(!email||!password)
        {
            return res.status(400).json({msg:"please enter all details..."})
        }

        User.findOne({email})
            .then(user=>{
                if(!user)
                {
                    return res.status(400).json({msg:"user does not exist.Please register before You login.."})
                }

                //compare password wheater it is valid or not
                bcrypt.compare(password,user.password)
                    .then(isMatch=>{
                        if(!isMatch)
                        {
                            return  res.status(400).json({msg:"Invalid User"})
                        }
                        //genertae jwt token
                        jwt.sign(
                            {id:user.id},
                            process.env.jwtSecret,
                            {expiresIn:7*3600},
                            (err,token)=>{
                                if(err) throw err;
                                res.json({
                                    token,
                                    user:{
                                        id:user.id,
                                        name:user.name,
                                        email:user.email
                                    }
                                })
                            }
                        )

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