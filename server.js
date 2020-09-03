const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const multer =require('multer')
const app = express();
const { user } = require('./model/user')
const { cv } = require('./model/cv');
const auth = require('./middleware/auth')
app.use(cors());
var port = process.env.port || 3000 ;
app.use(express.json());
app.post('/user/signup', async (req, res) => {
    var body = req.body;
    var newUser = new user(
        body
    );
    try {
        const data = await newUser.save();
        const token = await data.getAuthToken(); 
        res.send({data, token, status:true, message:"user successfuly signed up"});
    } catch (error) {
        // console.log(error);
        var errors={errMsg:{}};
        if(error.keyValue){
            if(error.keyValue.email){
                delete error.keyValue
                delete error.driver
                delete error.name
                delete error.index
                delete error.code
                delete error.keyPattern
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
            res.status(400).send({errors});
        }
   
    } catch (error) { 
          res.status(500).send({error});
    }    

});

var storage = multer.diskStorage({
    destination: './cvs/',
    filename: function (req, file, callback) {
        callback(undefined, Date.now() + ".pdf" ) 
    }
    ,
    limits: {
        fileSize: 800000
    },
    fileFilter(req, file , callback){
      
          if(!file.originalname.endsWith(".pdf")){
           
            return callback(new Error("please upload pdf file"))
        } 

        callback(undefined, true )
    }
  })
  
  var upload = multer({ storage: storage })


app.post('/user/upload/cv', [auth, upload.single('cv')] , async (req, res) => { 
    if(!req.file){
        res.status(400).send({
            errors:{
               msg: "please enter a file"
            }
        }) ;  
    }
    else{
        var userId = req.user._id;
        var {path} = req.file;
         
        var newCv = new cv(
        {path, userId}
        );
        try {
            const data = await newCv.save();
            if(data){
                res.send(
                    {data:{
                        status:true,
                        msg: "file uploaded sucessfully",
                        uploadData: data
                    }}
                ) 
            }
            
        } catch (error) {
            if(error.keyValue){
                if(error.keyValue.userId){
                    delete error.keyValue
                    delete error.driver
                    delete error.name
                    delete error.index
                    delete error.code
                    delete error.keyPattern
                    error.errors = {userId: {
                        properties: {
                        "message": "the user already uploaded a cv",
                        "type": "unique",
                        "path": "userId"
                    }
                }}
                    
                }  
            }
            // console.log("error from the catch block", error)
        res.status(400).send(error);
        }
      
    }
 
},
(error,req, res, next)=>{
   
   res.status(400).send({errors:{
       msg:error.message
   }})
});

app.get('/user/cv', auth, async (req, res)=>{
   const {_id} = req.user;
   const userCv = await cv.find({userId:_id});
   if(!userCv){
      res.status(404).send("cv not found");
      return;
   }
    res.send({userCv})
})

app.patch('/user/update', auth, async (req, res)=>{
    var ObjectId = mongoose.Types.ObjectId; 
    const userPassed = req.body;
      if(!user){
        res.status(400).send({errors:{
            errMsg: "please enter data to be updated"
        }});  
        return;
      } 
      const userToBeUpdate = req.user;
       
        let userReturned = '';
        try {
            if(userPassed.firstName){
                 await userToBeUpdate.updateOne(     
                     {
                        firstName : userPassed.firstName
                     } 
                    )  
            }
    
            if(userPassed.lastName){
                await userToBeUpdate.updateOne(     
                    {
                        lastName : userPassed.lastName
                    }
                   )      
            }
    
            if(userPassed.phoneNumber){
                await userToBeUpdate.updateOne(     
                    {
                        phoneNumber : userPassed.phoneNumber
                    }
                   ) 
            }
            if(userPassed.password){
                await userToBeUpdate.updateOne(     
                    {
                        password : userPassed.password
                    }
                   ) 
            }
            res.send({
                status: true,
                message: "you updated successfuly",
                updatedData: await user.findById(userToBeUpdate._id)
            })
        } catch (error) {
            console.log(error);
            res.status(400).send({error});
        }
     
     
 })

app.listen(3000, () => {
    console.log("the server started ...")
});