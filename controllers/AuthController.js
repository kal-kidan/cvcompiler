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
        res.send({user, token, status:true, msg:"user successfuly signed up"})
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
        }
        else{
            res.status(500).send(
                {
                    errors:{
                        msg : error.message
                    }
                }
            )

        }
                
             
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