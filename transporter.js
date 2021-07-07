const nodemailer=require('nodemailer')


module.exports=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    service:'gmail',
    auth:{
        user:process.env.user,
        pass:process.env.pass
    }
})
