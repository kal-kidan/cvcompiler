const { user } = require('./../model/user')  
const { validationResult } = require('express-validator')

const register = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
    }
    var body = req.body
    var newUser = new user(
        body
    )

    try {
        let user = await newUser.save()
        let token = await user.getAuthToken() 
        let subject = "From Cv Compiler: Here is your verifcation Link."
        let link =`https://localhost:4200/auth/verify/${token}`
        let message = `<html> 
        click the <a href=""> ${link} </a> to verify your account.
        </html>`
        let email = user.email
        let isEmailSent = sendEmail(email, subject, message)
        if(isEmailSent){
           return res.send({status:true, msg:"you have successfuly signed up check your email to verify"})
        }
       
       
    } catch (error) {    
        if(error.keyValue){
            if(error.keyValue.email){   
                let emailError  = {}
                let errorArray = {errors:[]}
                emailError.msg = 'this email has been taken'
                emailError.param = 'email'
                emailError.value = req.body.email
                emailError.location = 'body'
                errorArray.errors.push(emailError)
                res.status(400).send(errorArray)
            }
            else{
                return res.status(500).json( { status:false, error: true,  msg: error.message})
            }
        }
        else{
            res.status(500).send({errors:{msg : error.message}})
        }       
        }
}


function sendEmail(email, subject, message){
    try {
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
            connectionTimeout: 20000
        })
        
        const mailOptions = {
            from: 'kalkidant05@gmail.com',
            to: `${email}`,
            subject: `${subject}`,
            html: `${message}`
        }
        
        
         transporter.sendMail(mailOptions, function(error, info){
            if(error){
                throw error;
            }
            else{
               return true
            }
        })
    } catch (error) {
        throw error
     }
}
const login = async (req, res)=>{ 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
    }
    
    try {
       let User = await user.findByCredentials(req.body.email, req.body.password) 
        let errors={msg:''}
        if(User._id){
            let status = true
            const token = await User.getAuthToken() 
            res.send({user: User, token, status})
        }
        else{
            let status = false
            errors.msg=User
            res.status(400).send({errors, status})
        }
   
    } catch (error) { 
        console.log(error)
          res.status(500).send({
            errors:{
                error:true,
                msg: error.message
            }
          })
    }    

}
 module.exports = {
     register,
     login
 }