const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const multer =require('multer')
const app = express();
const { user } = require('./model/user')

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
            res.status(400).send(errors);
        }
   
    } catch (error) { 
          res.status(500).send(error);
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
// const upload = multer({
//     dest: "cvs",
//     filename: function (req, file, cb) {
//         callback(undefined, Date.now() + ".pdf" )
//     },
//     limits: {
//         fileSize: 800000
//     },
  
//     fileFilter(req, file , callback){
      
//           if(!file.originalname.endsWith(".pdf")){
           
//             return callback(new Error("please upload pdf file"))
//         } 

//         callback(undefined, true );
//     }
// })

app.post('/user/upload/cv', upload.single('cv') , (req, res) => { 
    if(!req.file){
        res.send({
            errors:{
               msg: "please enter a file"
            }
        }) ;  
        return;  
    }
 
    console.log(req.file);
    res.send(
        {data:{
            status:true,
            msg: "file uploaded sucessfully",
        }}
    ) 
},
(error,req, res, next)=>{
   
   res.status(400).send({errors:{
       msg:error.message
   }})
});

app.listen(3000, () => {
    console.log("the server started ...")
});