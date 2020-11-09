const { user } = require('./../model/user')  
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs');
const register = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(errors) 
    }
    
    try {
        let body = req.body
        let newUser = new user(
            body
        )
        let createdUser = await newUser.save()
        const emailToken = await jwt.sign({email: createdUser.email}, process.env.EMAIL_KEY); 
        let subject = "From Cv Compiler: Here is your verifcation Link."
        let link =`${process.env.URL_FRONT}/auth/verify/${emailToken}`
        let message = `<html> 
        <p> Thank you for signing up for Cv Compiler! Click the link below to verify your email, and we'll help you get started.
        click the <a href="${link}"> here </a> to verify your account. </P>
        </html>`
        let email = createdUser.email
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                },
                connectionTimeout: 60000
            })
            
            const mailOptions = {
                from: 'kalkidant05@gmail.com',
                to: `${email}`,
                subject: `${subject}`,
                html: `${message}`
            }
            
            
            await transporter.sendMail(mailOptions, function(error, info){
                if(error){ 
                    return res.status(500).json( { status:false, error: true,  msg: error.message})
                }
                else{
                    
                    return res.json({status:true, msg:"you have successfuly signed up check your email to verify"})
                }
            })
   
           
        } catch (error) {
            return res.status(500).json( { status:false, error: true,  msg: error.message})
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
                res.status(400).json(errorArray)
            }
            else{
                return res.status(500).json( { status:false, error: true,  msg: error.message})
            }
        }
        else{
            res.status(500).json({errors:{msg : error.message}})
        }       
        }
}

const verifyEmail = async (req, res)=>{
  try {
   
    if(!req.body){
        return res.status(400).json({error: true,status:false, msg: "enter token" })
    }
    const token = req.body.token
    const decodedToken = await jwt.verify(token, process.env.EMAIL_KEY)
    const {email} = decodedToken
    let User = await user.findOne({email})
    if(User){ 
        let updatedUser = await user.findOneAndUpdate({email}, {verified: true}, {new: true})
        if(updatedUser){
            return res.json({status: true, msg: "you email verified successfuly"})
        }
        else{
            return res.status(400).json({error: true, status: false,msg: "we couldn't verify your email" })
        }
         
    }
    else{
        return res.status(400).json({error: true, status: false,msg: "we couldn't verify your email" })
    }
  } catch (error) {
    return res.status(500).json({error: true, status: false,msg:error.message })
  }
}

const forgotPassword = async (req, res)=>{
    if(!req.body){
        return res.status(400).json({error: true,status:false, msg: "enter token" })
    }
   try {
    let email = req.body.email
    let checkUser = await user.findOne({email})
    if(!checkUser){
        return res.status(404).json({error: true, msg: "email not found"})
    }
    const emailToken = await jwt.sign({email}, process.env.FORGOT_PASSWORD_KEY)
    let subject = "From Cv Compiler: Here is your verifcation Link."
    let link =`${process.env.URL_FRONT}/auth/forgot-password/${emailToken}`
    let message = `<html> 
       <p> 
       Hi ${checkUser.firstName}, To finish setting up your password, we just need to make sure this email address is yours.
       Please click <a href="${link}"> here </a> to change your passord.
       </p>
    </html>`
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
            connectionTimeout: 60000
        })
        
        const mailOptions = {
            from: 'kalkidant05@gmail.com',
            to: `${email}`,
            subject: `${subject}`,
            html: `${message}`
        }
        
        await transporter.sendMail(mailOptions, function(error, info){
            if(error){ 
                return res.status(500).json( { status:false, error: true,  msg: error.message})
            }
            else{
                
                return res.json({status:true, msg:"verification email has been sent, please check your email"})
            }
        })
   } catch (error) {
        return res.status(500).json( { status:false, error: true,  msg: error.message})
   }
}

const resetPassword = async (req, res)=>{
  try {
    if(!req.body){
        return res.status(400).json({error: true,status:false, msg: "enter password" })
    }
    let token = req.body.token
    const decodedToken = await jwt.verify(token, process.env.FORGOT_PASSWORD_KEY)
    const {email} = decodedToken
    let password = await bcrypt.hash(req.body.password, 8)
    let User = await user.findOne({email})
    if(User){ 
        let updatedUser = await user.findOneAndUpdate({email}, {password}, {new: true})
        if(updatedUser){
            return res.json({status: true, msg: "you have reset your password successfuly"})
        }
        else{
            return res.status(400).json({error: true, status: false,msg: "we couldn'treset your password" })
        }
         
    }
    else{
        return res.status(404).json({error: true, status: false,msg: "we couldn't reset your password" })
    } 
  } catch (error) {
    return res.status(404).json({error: true, status: false,msg: error.message })
  }
  
}

const login = async (req, res)=>{ 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(errors) 
    }
    
    try {
       let User = await user.findByCredentials(req.body.email, req.body.password) 
        let errors={msg:''}
        if(User._id ){
            if(User.verified === false){
                return res.status(400).json({error:true, status: false,msg: "please verify your email"})
            }
            let status = true
            const token = await User.getAuthToken() 
            return  res.json({user: User, token, status})
        }
        else{
            let status = false 
           return res.status(400).json({error:true, status,msg: "incorrect password or username"})
        }
   
    } catch (error) { 
        return res.status(500).json({
            errors:{
                error:true,
                msg: error.message
            }
          })
    }    

}
 module.exports = {
     register,
     login,
     verifyEmail,
     forgotPassword,
     resetPassword
 }