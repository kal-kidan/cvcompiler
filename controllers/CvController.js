const multer = require("multer");
const path = require("path"); 

const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 
const helper = require("./helper");

const uploadImage = async (req, res) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/images");
      },
      filename: helper.renameFile 
    });
    const upload = multer({
      storage: storage,
      limits: { fileSize: 1024*1024*3 },
      fileFilter: helper.validateExtension 
    }).single("cvprofile");
  
    upload(req, res, async function(err) {
     if(err){
         res.send({
             error: true,
             msg: err.message
         })
     }
     else{
        try {
            await cv.findOneAndUpdate({user: req.user._id}, {cvProfileImage: `/uploads/images/${req.fileName}`})
            res.json({status: true, msg: "image uploaded successfuly"}) 
        } catch (error) {
            res.status(500).json({error: true, msg: error.message})
        }
     }
  });
    
  };

  module.exports = {
      uploadImage
  }