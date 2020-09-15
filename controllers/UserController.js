const multer = require("multer");
const path = require("path");
const  fs  = require("fs");
const bcrypt = require('bcryptjs');
const { user } = require("./../model/user");
const { cv } = require("./../model/cv");
const { adminCv } = require("./../model/adminCv");
const {mongoose} = require("./../connect");
const helper = require("./helper");


const uploadCv = async (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/cvs");
    },
    filename: helper.renameFile 
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024*1024*3 },
    fileFilter: helper.validateExtension 
  }).single("cv");

  upload(req, res, function(err) {
  validateAndUploadFile(req,res,err);
    
});
  
};

function validateAndUploadFile(req,res,err){
     
    if (req.fileValidationError) {
        return res.status(400).send({
            errors:{
                msg:req.fileValidationError
            }
        });
    }

    else if (err instanceof multer.MulterError) {
      if(err.code == "LIMIT_FILE_SIZE"){
        return res.status(400).send(
          {
            errors:{msg: "the file is too large"}
          }
        );
      }
        return res.status(500).send(err);
    }
    else if (err) {
        return res.status(500).send(err);
    }
    else if (!req.file) {
      return res.status(400).send({
          errors:{
              msg:'please enter file'
          }
      });
      
  }
    else{
        saveCv(req,res)
    }
}

async function saveCv(req, res) {
  var userId = req.user._id;
  var { path } = req.file;

  var newCv = new cv({ path, userId });
  try {
    const data = await newCv.save(); 
    if (data) {
      const bool = await assignCv(req,res, data._id) 
      if(bool){
        res.send({
          data: {
            status: true,
            msg: "file uploaded sucessfully",
            uploadData: data,
          },
        });
        return;
      }
      res.status(500).send({error:{msg: "can not add the cv"}})
   
    }
  } catch (error) { 
    if (error.keyValue) {
      if (error.keyValue.userId) {
        let uploadError  = {} 
        uploadError.msg = 'you already uploaded a cv'
        uploadError.param = 'userId'
        uploadError.value = req.user._id
        uploadError.location = 'body' 
        res.status(400).send({errors: uploadError}); 
      }
      else{
        res.status(500).send(error)
      }
    }
   
  }
}

 

async function assignCv(req,res, cvId){
  
    let admin = await user.find({role: "admin"}, null, { 
      skip:0, 
      limit:1, 
        sort:{
      assignedCv: 1
    } 
  })

  admin = admin[0] 

    const newAdmin = new adminCv({
        adminId: admin._id,
        cvId: cvId
    }) 
   const addedAdmin = await newAdmin.save()
   const updatedAdmin = await user.findOneAndUpdate({ _id: admin._id}, { $inc: { assignedCv: 1 } }, {new: true } )
    if( !(addedAdmin || updatedAdmin) ){
      return false
    }

    return true
   
 
  
}





const getCv = async (req, res) => {
  const { _id } = req.user;  
  const userCv = await cv.findOne({ userId: _id });
  if (!userCv) {
    res.status(404).send("cv not found");
    return;
  }
  const path = userCv.path; 
  fs.readFile(path, (err, data)=>{
      if(err){
           console.log(err)
           return
      }
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=some_file.pdf',
        'Content-Length': data.length
      });
       res.end(data)
  })

};

const updateUser = async (req, res) => { 
  let userPassed = {}
  if (!req.body) {
    res.status(400).send({
      errors: {
        msg: "please enter data to be updated",
      },
    });
    return;
  }
 
  if(req.body.password){
    userPassed.password = req.body.password;
  }

  const {_id} = req.user;
  if(userPassed.password){
    try {
      userPassed.password = await bcrypt.hash(userPassed.password, 8) 
    } catch (error) {
      res.send(error)
    }
   
}

  let userReturned = "";
  user.findOneAndUpdate(
     {_id},
     userPassed,
     {new: true, runValidators: true, useFindAndModify:false } ,
     function(err, result){
       if(err){
         console.log(err)
          res.status(500).send(err)
          
       }
       else{
        res.send({
          data: result,
          status: true,
          msg: "user updated sucessfuly"
        })
       }
     }
     )

   
  
};


module.exports = {
  uploadCv,
  updateUser,
  getCv,
};
