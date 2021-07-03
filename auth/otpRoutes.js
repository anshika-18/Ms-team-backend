require('dotenv').config()
const nodemailer=require('nodemailer')
const User=require('./userModel')
const bcrypt=require('bcryptjs')

module.exports=(app)=>{
        var email;
        let transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            service:'gmail',
            auth:{
                user:process.env.user,
                pass:process.env.pass
            }
        })
    
        var otp=Math.random();
        otp=otp*10000;
        otp=parseInt(otp);
        console.log(otp)

        app.post("/sendOtp",(req,res)=>{
        
                email=req.body.email;
                //console.log(req.body.roll)
                console.log(req.body.email)
                
                var mailOptions={
                    to:req.body.email,
                    subject:"OTP for registration : ",
                    html:"<h3>OTP for account verification is </h3>"+"<h1 style='font-weight:bold'>"+otp+"</h1>"
                };
        
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent : %s',info.messageId);
                    console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
        
                    res.send(' otp sent');
                })
                
               res.send('sent')
        })

        //resend otp
        app.post("/resend",(req,res)=>{
    
                var mailOptions={
                    to:email,
                    subject:"OTP for registration : ",
                    html:"<h3>OTP for account verification is </h3>"+"<h1 style='font-weight:bold'>"+otp+"</h1>"
                };
        
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent : %s',info.messageId);
                    console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
        
                    res.json({msg:"otp has been sent"});
                })
        })
        
        
        
        //register to ms-team
        app.post('/api/auth/register',(req,res)=>{
        const {name,email,password}=req.body

        if(!name||!email||!password)
        {
            return res.status(400).json({msg:'Please enter all details ...'})
        }
        
        if(req.body.otp==otp)
        {
            console.log('matches');
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
                                                res.json({
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
                                })
                            }
                        })
                    

                }
            })
            .catch(err=>{
                return res.status(500).json(err)
            })
        
        }
        else
        {
            console.log('not match')
            res.status(400).json({msg:"incorrect otp"})
        }

    })        


        
}