const multer = require("multer");
const path = require("path"); 
const bcrypt = require('bcryptjs');
const fs = require('fs')
const pdfparse = require('pdf-parse')

const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 
const helper = require("./helper");
// const { start } = require("repl");

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
  let uploadedSection = await sectionCv(req.fileName) 
  var userId = req.user._id;
  var { path } = req.file;
  let admin = await user.find({role: "admin"}, null, { 
    skip:0, 
    limit:1, 
      sort:{
    assignedCv: 1
  } 
})
if(admin.length === 0){
  return res.send(
   {
     error:{
       error: true,
       msg: "there is no any admin in the database"
     }
   }
  )
}
  admin = admin[0] 
  const adminId = admin._id

  var newCv = new cv({ path, user:userId, adminId, uploadedSection });
  try {
    const data = await newCv.save(); 
    if (data) { 
      const bool = await assignCv(req,res, adminId) 
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
      if (error.keyValue.user) {
        let uploadError  = {} 
        uploadError.msg = 'you already uploaded a cv'
        uploadError.param = 'user'
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

 
async function sectionCv(fileName){
  let fullPath =  path.resolve(__dirname+`/../uploads/cvs/${fileName}` )
  const file = fs.readFileSync(fullPath)
  let data = await pdfparse(file)
  let sections = await section.find({})
  let {text} = data 
  text = text.toString()
  text = text.trim()
  let cvSections = []
  sections.forEach((section, index)=>{
    let Section = section.name + " \n"
    var regex = new RegExp( `${Section}`  , "ig")
    let start = text.search(regex) 
    cvSections.push({start, name:section.name, _id: section._id}) 
  })
   
  // extract description for each of the section from the user cv
  let uploadedSection = []
  cvSections = cvSections.sort(function(a, b){return  a.start - b.start })

  cvSections.forEach((cvsection,index)=>{
    let description
    let start
    let end
    if(index===cvSections.length-1){
       start = cvSections[index].start + cvsection.name.length
      description = text.substring(start)
    
    }
    else{
       start = cvSections[index].start + cvsection.name.length
       end =  cvSections[index+1].start 
      description = text.substring(start, end) 
    }
    description = description.replace("\n", "")
      uploadedSection.push(
        {
          sectionId: cvsection._id,
          description

        }
      )   
  })
  return uploadedSection
  
 
  // .catch(()=>{
  //   res.status(400).send({
  //     error: true,
  //     msg: error.message
  //   })
  // })

}

 



async function assignCv(req,res, adminId){
  
   const updatedAdmin = await user.findOneAndUpdate({ _id: adminId}, { $inc: { assignedCv: 1 } }, {new: true } )
    if( !updatedAdmin ){
      return false
    }

    return true
  
}

const getCv = async (req, res) => {
  const { _id } = req.user;  
  const userCv = await cv.findOne({ user: _id });
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

const getUserCv = async (req, res) => {
  const { _id } = req.user;  
  const userCv = await cv.findOne({ user: _id });
  if (!userCv) {
    return res.status(404).send({
      error: true,
      msg: "cv not found"
    });
   
  }
  res.send({
    userCv
  })

};

const getRecommendation = async (req, res)=>{
  try {
    let {_id} = req.user
    let Cv = await cv.find({user:_id})
    if(!Cv){
      res.send({
        error:{
          error: true,
          msg: "this user hasn't uploaded cv"
        }
      })
    }
    let {recommendation} = Cv
    res.send({recommendation})
  } catch (error) {
    res.status(500).send({
      error: true,
      msg: error.message
    })
  }
}

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

const saveAll = async (req,res)=>{

  const cvSections = req.body.sections
  const {cvId} = req.body
  try {
    let userCv = await cv.findOne({user:req.user._id, _id:cvId});
    if(! userCv ){
      return res.status(404).send({
        error: true,
        msg: "user cv is not found"
    })
    }
  } catch (error) {
    return res.status(400).send(
      {error:true,
      msg: error.message}
    )
  }
 
  for(let i=0; i<cvSections.length; i++){
    let {sectionId} = cvSections[i]
    let {description} = cvSections[i]
    let editedSection ={sectionId,description}
    let query = {
      'editedSections.sectionId': sectionId 
      };
      cv.findOne(query).then(async (doc) =>  {
        if(doc){
          updateEditedSection(req,res,doc,cvSections[i])
        }
        else {
          addEdittedRecommendation(req,res,editedSection)
        }
       
    }).catch(err => {
      console.log(err)
       return res.status(500).send({
            error: true,
            msg: err.messsage
        })
        
        
    });
  
} 
return res.send({
  status: true,
  msg: "you have successfully edited admin recommendation" 

})
  }


const updateEditedSection  = async (req, res, doc,cvSection) =>{
  try {
    let {sectionId} = cvSection
    let {description} = cvSection
    sectionToEdit =  doc.editedSections.find(section=> section.sectionId == sectionId)
    let _id = sectionToEdit._id
    let section = doc.editedSections.id(_id)
    section["description"] = description
    section["updatedAt"] = Date.now()
    await doc.save();
  } catch (error) {
    console.log("from update edited section",error)
   return res.status(500).send({
      error: true,
      msg: error.messsage
  })
  }
}

  
 const addEdittedRecommendation = async (req, res, editedSection)=>{
   let userId = req.user._id;
   let {cvId} = req.body
  try {
    let updatedSection = await cv.findOneAndUpdate(
      {user:userId, _id:cvId},
      {
        $addToSet: {editedSections: editedSection} 
      }
      )
   } catch (error) {
    console.log("from add edited section",error)
    return res.status(500).send({
      error: true,
      msg: error.messsage
  })
   }

 }
 

const updateRecommendation = async (req, res)=>{
  try {
      const {sectionId} = req.params 
      const {description} = req.body 
      const editedSection ={sectionId,description}
      let userId = req.user._id
      let {cvId} = req.body
      const query = {
      'editedSections.sectionId': sectionId 
      };
      cv.findOne(query).then(async (doc) =>  {
          if(!doc){
            console.log(editedSection)
            let updatedSection = await cv.findOneAndUpdate(
              {user:userId,_id:cvId},
              {
                 $addToSet: {editedSections: editedSection} 
              }
              )
              
         if(updatedSection.nModified !== 1){
            return res.status(404).send({
                 error: true,
                 msg: "cv not found make sure you have the right privillege"
             })
         }
         return res.send({
             status: true,
             msg: "you have successfully edited cv section",
             updatedData: doc
   
         })
       
          }
          editedSections = doc.editedSections
          sectionToEdit = editedSections.find(section=> section.sectionId == sectionId)
          let _id = sectionToEdit._id
          let section = doc.editedSections.id(_id)
          section["description"] = description
          doc.save();
          return res.send({
              status: true,
              msg: "you have successfully edited admin recommendation",
              updatedData: doc
  
          })
      }).catch(err => {
          res.status(500).send({
              error: true,
              msg: err.messsage
          })
          console.log(err)
      });
    
  } catch (error) {
      console.log(error)
      res.status(500).send({
          error: true,
          msg: error.messsage
      })
  }
}
const getDetailedUserCv = async (req, res) => {
  const { userId } = req.params
  const userCv = await cv.findOne({user: userId }).select('_id status adminId uploadedSection recommendation editedSections createdAt updatedAt')
  if (!userCv) {
    return res.status(404).send({
      error: true,
      msg: "cv not found"
    })
   
  }
  let sections = []
  const {recommendation} = userCv
  const {uploadedSection} = userCv
  const {editedSections} = userCv
  const {createdAt} = userCv
  const {updatedAt} = userCv
  const dbsections = await section.find({}).select('_id name category')
   uploadedSection.forEach((uploadedSection, index)=>{
       if(!recommendation[index]){
          recommendation[index] = ''
       }
       if(!editedSections[index]){
        editedSections[index] = ''
     }
     
       
       let sectionId = uploadedSection.sectionId
       let section = dbsections[index]
       sections.push({sectionId, section,uploaded: uploadedSection.description, recommended: recommendation[index], editedSection: editedSections[index]})
   })
  res.send({
      sections,
      createdAt,
      updatedAt 
  })

};

module.exports = {
  uploadCv,
  updateUser,
  getCv,
  getRecommendation,
  updateRecommendation,
  getUserCv,
  saveAll,
  getDetailedUserCv
};
