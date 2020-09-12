const { user } = require('./../model/user')
const { cv } = require('./../model/cv')
const { adminCv } = require('./../model/adminCv')
const mongoose = require("./../connect");

const register = async (req, res) => {
    var body = req.body;
    var newUser = new user(
        body
    );
    try {
        const data = await newUser.save();
        const token = await data.getAuthToken(); 
        res.send({data, token, status:true, message:"user successfuly signed up"});
    } catch (error) { 
        var errors={errMsg:{}};
        if(error.keyValue){
            if(error.keyValue.email){
                delete error.keyValue ;delete error.driver ;delete error.name ;delete error.index;delete error.code;delete error.keyPattern
                error.errors = {email: {
                    properties: {
                    "message": "this email has been taken",
                    "type": "taken",
                    "path": "email"
                }
            }}
                
            }  
        }
      
        res.status(400).send(error);   
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