
const bcrypt = require('bcryptjs');
const fs = require('fs')
const { validationResult } = require('express-validator')
const formValidator = require('./../middleware/form-validator')

const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 


 
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
    return res.status(404).json({
      error: true,
      msg: "cv not found"
    });
  }
  const path = userCv.path; 
  fs.readFile(path, (err, data)=>{
      if(err){ 
           return res.json({error:true, msg: err.message})
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
    return res.status(404).json({
      error: true,
      msg: "cv not found"
    });
   
  }
  return res.json({
    userCv
  })

};

const getRecommendation = async (req, res)=>{
  try {
    let {_id} = req.params
    let Cv = await cv.findOne({user:_id})
    if(!Cv){
      return res.json({
        error:{
          error: true,
          msg: "this user hasn't uploaded cv"
        }
      })
    }
    let {recommendation} = Cv
    return res.json({recommendation})
  } catch (error) {
    return res.status(500).json({
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
      return res.json({
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
   return res.json({
      data: result,
      status: true,
      msg: "user updated sucessfuly"
    })
  }
 } catch (error) {
    return res.status(400).json(
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
    return res.status(404).json({
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
      'uploadedSection.sectionId': sectionId 
      };
      const doc = await cv.findOne(query)
      if(doc){
        updateEditedSection(req,res,doc,cvSections[i])
      }
      else{
        // addEdittedRecommendation(req,res,editedSection) 
         res.status(404).json({error: true, msg: "not found"})
     }       
  } 

  return res.json({
    status: true,
    msg: "you have updated successfully" 
  
  })
 } catch (error) {
      return res.status(500).json({
        error: true,
        msg: error.messsage
    })
 }

   

  }


const updateEditedSection  = async (req, res, doc,cvSection) =>{
  try {
    let {sectionId} = cvSection
    let {description} = cvSection
    let sectionToEdit =  doc.uploadedSection.find(section=> section.sectionId == sectionId)
    let _id = sectionToEdit._id
    let section = doc.uploadedSection.id(_id)
    if(section){ 
      section["description"] = description
      section["updatedAt"] = Date.now()
    await doc.save();
    }
    
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
        $addToSet: {uploadedSection: editedSection} 
      },
      {useFindAndModify: false}
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
              },
              {useFindAndModify: false}
              )
              
         if(updatedSection.nModified !== 1){
            return res.status(404).return({
                 error: true,
                 msg: "cv not found make sure you have the right privillege"
             })
         }
         return res.json({
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
          await doc.save();
          return res.json({
              status: true,
              msg: "you have successfully edited admin recommendation",
              updatedData: doc
  
          })
      }).catch(err => {
          res.status(500).json({
              error: true,
              msg: err.messsage
          })
          
      });
    
  } catch (error) {
      return res.status(500).json({
          error: true,
          msg: error.messsage
      })
  }
}
const getDetailedUserCv = async (req, res) => {
  const { _id } = req.params
  const userCv = await cv.findOne({user: _id }).select('_id status adminId cvProfileImage uploadedSection recommendation editedSections createdAt updatedAt')
  if (!userCv) {
    return res.status(404).json({
      error: true,
      msg: "cv not found"
    })
   
  }
  let sections = []
  const {recommendation} = userCv
  const uploadedSections = userCv.uploadedSection
  const {createdAt} = userCv
  const {updatedAt} = userCv
  const dbsections = await section.find({}).select('_id name category')

 
 
  dbsections.forEach((section, index)=>{
     let sectionId = section._id
        let uploadedSection = uploadedSections[index]
        let recommendationIsFound = false;
       for(let rc of recommendation){
         if(rc.name == section.name){
              sections.push({sectionId, section,name: section.name, uploaded: uploadedSection.description, recommended: rc.description})
              recommendationIsFound=true
            }
          
         }
         if(!recommendationIsFound){
          sections.push({sectionId, section,name: section.name, uploaded: uploadedSection.description, recommended: [] })
          recommendationIsFound=false
       }
 
  })
  
  return res.json({
      sections,
      cvProfileImage: userCv.cvProfileImage,
      userSectionUpdatedAt: getLatestUpdate(uploadedSections),
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
  let uploadedSection = req.body.sections
  uploadedSection = uploadedSection.sort(function(a, b){
    let an = a.name.toLowerCase()
    let bn = b.name.toLowerCase()
     if (an < bn) {
         return -1;
     }
     if (an > bn) {
         return 1;
     }
     return 0; 
 })
  try {
    let admin = await user.findOne({role: "admin"}, null, { 
      skip:0, 
      limit:1, 
        sort:{
      assignedCv: 1
    } 
  })
 
  if (!admin) return res.status(500).json({error:true, msg: "there is no registered admin"})
  const cvData = await cv.create({uploadedSection, user: req.user._id, admin: admin._id})
  if (cvData) { 
    const bool = await assignCv(req,res, admin._id) 
    if(bool){
      return res.json({
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
        return res.status(400).json({error:true, msg: 'you have already added sections'}); 
      }
    }
    return res.status(500).json({error:true, msg: error.message})
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
