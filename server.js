const express = require("express");
const mongoose = require("mongoose");
const { user } = require('./model/user')
const app = express();
var port = process.env.port || 3000 ;
app.use(express.json());
app.post('/user/signup', async (req, res) => {
    var body = req.body;
    var newUser = new user(
        body
    );
    try {
        const savedUser = await newUser.save();
        const token = await savedUser.getAuthToken(); 
        res.send({savedUser, token});
    } catch (error) {
        var errors={errMsg:{}};
        if(error.keyValue){
            if(error.keyValue.email){
                errors.errMsg.email="this email has been taken"; 
            }  
        }
         if(error.errors){
            if(error.errors.password){
                errors.errMsg.password="password length should be at least 6";    
            } 
            if(error.errors.firstname){
                errors.errMsg.firstname="please enter valid name";    
            } 
            if(error.errors.lastname){
                errors.errMsg.lastname="please enter valid name";    
            } 
        }
        res.status(400).send(errors);   
    }

});

app.post('/user/login', async (req, res)=>{ 
    try {
        const users = await user.findByCredentials(req.body.email, req.body.password);
        let errors={errMsg:''}
        if(users._id){
            const token = await users.getAuthToken();  
            res.send({users, token});
        }
        else{
            errors.errMsg=users;
            res.status(400).send(errors);
        }
   
    } catch (error) { 
          res.status(500).send(error);
    }    

});


app.listen(3000, () => {
    console.log("the server started ...")
});