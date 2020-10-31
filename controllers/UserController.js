const multer = require("multer");
const path = require("path"); 
const bcrypt = require('bcryptjs');
const fs = require('fs')
const { validationResult } = require('express-validator')
const pdfparse = require('pdf-parse')
const formValidator = require('./../middleware/form-validator')

const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 
const helper = require("./helper");

 
async function assignCv(req,res, adminId){
  
   const updatedAdmin = await user.findOneAndUpdate({ _id: adminId}, { $inc: { assignedCv: 1 } }, {new: true, useFindAndModify: false } )
    if( !updatedAdmin ){
      return false
    }

    return true
  
}

const getCv = async (req, res) => {
  const  _id  = req.params._id;  
  const userCv = await cv.findOne({ _id});
  if (!userCv) {
    res.status(404).send({
      error: true,
      msg: "cv not found"
    });
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
    let {_id} = req.params
    let Cv = await cv.findOne({user:_id})
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
  const errors = validationResult(req) 
  if(!errors.isEmpty()){
    return res.status(400).send(errors)  
  }
  let userPassed = req.body
  const {_id} = req.params;
  if(req.body.password){
    try {
      userPassed.password = await bcrypt.hash(req.body.password, 8) 
    } catch (error) {
      return res.send({
        error: true,
        msg: error.message
      })
    }
   
}

 try {
  let updatedUser = await user.findOne({_id})
  updatedUser.firstName = userPassed.firstName
  updatedUser.lastName = userPassed.lastName
  updatedUser.email = userPassed.email
  updatedUser.phoneNumber = userPassed.phoneNumber
  updatedUser.password = userPassed.password
  let result  = await updatedUser.save();
  if(result){
   return res.send({
      data: result,
      status: true,
      msg: "user updated sucessfuly"
    })
  }
 } catch (error) {
  return res.status(400).send(
    {
      error: true,
      msg: error.message
    }
  )
 }
 
   
};
const isCvFound= async (userId, cvId)=>{
  try {
    let userCv = await cv.findOne({user:userId, _id:cvId});
    if(! userCv ){
       return false
    }
       return true
  } catch (error) {
      throw error
  }
}

const saveAll = async (req,res)=>{

  const cvSections = req.body.sections
  const {cvId} = req.params
  if(!isCvFound(req.user._id, cvId)){
    return res.status(404).send({
        error: true,
        msg: "cv not found"
    })
  }
     
 try {
  for(let i=0; i<cvSections.length; i++){
    let {sectionId} = cvSections[i]
    let {description} = cvSections[i]
    let editedSection ={sectionId,description}
  
    let query = {
      'editedSections.sectionId': sectionId 
      };
      const doc = await cv.findOne(query)
      if(doc){
        updateEditedSection(req,res,doc,cvSections[i])
      }
      else{
        addEdittedRecommendation(req,res,editedSection) 
     }       
  } 

  return res.send({
    status: true,
    msg: "you have successfully edited admin recommendation" 
  
  })
 } catch (error) {
      return res.status(500).send({
        error: true,
        msg: error.messsage
    })
 }

   

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
   throw error
  }
}

  
 const addEdittedRecommendation = async (req, res, editedSection)=>{
   let userId = req.user._id;
   let {cvId} = req.params
  try {
    let updatedSection = await cv.findOneAndUpdate(
      {user:userId, _id:cvId},
      {
        $addToSet: {editedSections: editedSection} 
      }
      )
   } catch (error) {
       throw error
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
          
      });
    
  } catch (error) {
      res.status(500).send({
          error: true,
          msg: error.messsage
      })
  }
}
const getDetailedUserCv = async (req, res) => {
  const { _id } = req.params
  const userCv = await cv.findOne({_id }).select('_id status adminId uploadedSection recommendation editedSections createdAt updatedAt')
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
          recommendation[index] = {description:''}
       }
       if(!editedSections[index]){
        editedSections[index] = {description:'', updatedAt: ''}
     }
       let sectionId = uploadedSection.sectionId
       let section = dbsections[index]
       sections.push({sectionId, section,uploaded: uploadedSection.description, recommended: recommendation[index].description, editedSection: editedSections[index].description})
   })
  res.send({
      sections,
      userSectionUpdatedAt: getLatestUpdate(editedSections),
      cvCreatedAt: createdAt,
      cvUpdatedAt: updatedAt 
  })

}

// get the most recent update time
function getLatestUpdate(datas){
  let updatedAt = '';
  datas.forEach((data, index)=>{
      updatedAt = updatedAt > data.updatedAt ? updatedAt:data.updatedAt
   })
   
   return updatedAt
}

// add cv from a form
const addCv = async (req, res)=>{
  const uploadedSection = req.body.sections
  try {
    let admin = await user.findOne({role: "admin"}, null, { 
      skip:0, 
      limit:1, 
        sort:{
      assignedCv: 1
    } 
  })
 
  if (!admin) return res.status(500).send({error:true, msg: "there is no registered admin"})
  const cvData = await cv.create({uploadedSection, user: req.user._id, admin: admin._id})
  if (cvData) { 
    const bool = await assignCv(req,res, admin._id) 
    if(bool){
      return res.send({
        data: {
          status: true,
          msg: "cv sections uploaded sucessfully",
          uploadData: cvData,
        },
      });
      
    }
  }
  } catch (error) {
    if (error.keyValue) {
      if (error.keyValue.user) { 
        return res.status(400).send({error:true, msg: 'you have already added sections'}); 
      }
    }
    return res.status(500).send({error:true, msg: error.message})
  }
}


module.exports = {  
  updateUser,
  getCv,
  getRecommendation,
  updateRecommendation,
  getUserCv,
  saveAll,
  getDetailedUserCv,
  addCv
};
