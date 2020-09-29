const { user } = require('./../model/user')
const { cv } = require('./../model/cv') 
const mongoose = require("./../connect");
const { validationResult, check } = require('express-validator');

const register = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
    }
    var body = req.body;
    var newUser = new user(
        body
    );

    try {
        const data = await newUser.save();
        const token = await data.getAuthToken(); 
        res.send({data, token, status:true, msg:"user successfuly signed up"});
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
                res.status(400).send(errorArray); 
            }
        }
        else{
            res.status(500).send(error)
        }
                
             
        }
      
         
    

}
const login = async (req, res)=>{ 
    try {
        const users = await user.findByCredentials(req.body.email, req.body.password);
        let errors={msg:''}
        if(users._id){
            let status = true
            const token = await users.getAuthToken();  
            res.send({users, token, status});
        }
        else{
            let status = false
            errors.msg=users;
            res.status(400).send({errors, status});
        }
   
    } catch (errors) { 
          res.status(500).send({errors});
    }    

}
 module.exports = {
     register,
     login
 }