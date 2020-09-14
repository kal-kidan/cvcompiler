const { user } = require('./../model/user')
const { cv } = require('./../model/cv')
const { adminCv } = require('./../model/adminCv')
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
        res.send({data, token, status:true, message:"user successfuly signed up"});
    } catch (error) {    
        if(error.keyValue){
            if(error.keyValue.email){   
                let emailError  = {}
                let errorArray = []
                emailError.msg = 'this email has been taken'
                emailError.param = 'email'
                emailError.value = req.body.email
                emailError.location = 'body'
                errorArray.push(emailError)
                res.status(400).send(errorArray); 
            }
        }
                
             
        }
      
         
    

}
const login = async (req, res)=>{ 
    try {
        const users = await user.findByCredentials(req.body.email, req.body.password);
        let errors={errMsg:''}
        if(users._id){
            const token = await users.getAuthToken();  
            res.send({users, token});
        }
        else{
            errors.errMsg=users;
            res.status(400).send({errors});
        }
   
    } catch (error) { 
          res.status(500).send({error});
    }    

}
 module.exports = {
     register,
     login
 }