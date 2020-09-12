const multer = require("multer");
const path = require("path");
const  fs  = require("fs");

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
            errors:{errMsg: "the file is too large"}
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
      res.send({
        data: {
          status: true,
          msg: "file uploaded sucessfully",
          uploadData: data,
        },
      });
    }
  } catch (error) {
   
    sendError(error, res);
   
  }
}


function sendError(error, res){
  if (error.keyValue) {
    if (error.keyValue.userId) {
      delete error.keyValue;  delete error.driver; delete error.name; delete error.index; delete error.code; delete error.keyPattern;
      error.errors = {
        userId: {
          properties: {
            message: "the user already uploaded a cv",
            type: "unique",
            path: "userId",
          },
        },
      };
    }
  }
  res.status(400).send(error);
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
  const userPassed = req.body;
  if (!user) {
    res.status(400).send({
      errors: {
        errMsg: "please enter data to be updated",
      },
    });
    return;
  }
  const userToBeUpdate = req.user;
  const {_id} = userToBeUpdate;

  let userReturned = "";
  user.findOneAndUpdate(
     {_id},
     userPassed,
     {new: true, runValidators: true, useFindAndModify:false },
     function(err, result){
       if(err){
          res.send(err)
       }
       else{
        res.send({
          data: result,
          status: true,
          message: "user updated sucessfuly"
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
