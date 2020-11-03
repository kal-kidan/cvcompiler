const nodemailer = require('nodemailer')
const { user } = require('../model/user')
const { cv } = require('../model/cv') 
const { section } = require('../model/section') 

const getCv = async (req, res)=>{
    let admin = req.user
    let adminId = admin._id 
    let {status} = req.params
    if(status === "onprogress" || status === "new" || status === "sent"){
        try {
            const cvsAssigned = await cv.find({status,admin: adminId}).select('_id user createdAt updatedAt').populate('user')
            res.send(cvsAssigned)
       
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    else{
        res.status(404).send({
            error:{
                error: true,
            msg: `/admin/assigned-cv/${status} not found`
            }
        })
    } 
}
const isAdminFound = async (cvId, adminId) =>{
  const Cv  = await cv.findOne({_id: cvId, admin: adminId})
  if(!Cv){
      return false
  }
  return true
}
const addAllRecommendation = async (req, res)=>{
    let {recommendations} = req.body
    recommendations = recommendations.sort(function(a, b){
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
    let cvId = req.params._id 
    let adminId = req.user._id
    
    try {
        const bool = await isAdminFound(cvId, adminId)
        if(!bool){
            return res.status(404).send({
                error: true,
                msg: "cv not found"
            })
        }
        for(let i=0;i<recommendations.length;i++){
            let recommendation = recommendations[i]
            const query = { 'recommendation.sectionId': recommendation.sectionId }
            const doc = await cv.findOne(query)
            if(doc){
                updateRecommendation(req,res,doc,recommendation)
            }
            else{
               addRecommendation(req,res,recommendation,cvId)     
           }    
    }
        
    } catch (error) {
        return res.status(400).send({
            error: true,
            msg: error.message
        })
    }

    
    return res.send({
        status: true,
        msg: "you have successfully added recommendation",

    })
         
}

const addRecommendation = async (req, res,recommendation, cvId)=>{
    try {
        let adminId = req.user._id
        await cv.updateOne(
            {_id:cvId, admin: adminId },
            { $addToSet: {recommendation} }, 
                )
        let updatedCv = await  cv.findOneAndUpdate({_id:cvId}, {status: "onprogress"}, {new: true})

    } catch (error) {
     throw error
    }
        
}
const updateRecommendation = async (req, res,doc,rc)=>{
    try {
        let _id = doc.recommendation.find(section=> section.sectionId == rc.sectionId)._id
        recommendation = doc.recommendation.id(_id); 
        recommendation["description"] = rc.description;
        recommendation["updatedAt"] = Date.now()
        doc.save();
    } catch (error) {
        throw error
    }
}


const getUserCv = async (req, res) => {
    const { _id } = req.params
    const userCv =  await cv.findOne({ _id }).populate('user').select('_id status adminId user createdAt updatedAt')
    if (!userCv) {
      return res.status(404).send({
        error: true,
        msg: "cv not found"
      })
     
    }
    res.send({
      userCv
    })
  
  };

  const getDetailedUserCv = async (req, res) => {
    const { _id } = req.params
    const userCv = await cv.findOne({ _id }).populate('user').select('_id status adminId uploadedSection recommendation createdAt updatedAt')
    if (!userCv) {
      return res.status(404).send({
        error: true,
        msg: "cv not found"
      })
     
    }
    let sections = []
    const {recommendation} = userCv
    const uploadedSections = userCv.uploadedSection
    const dbsections = await section.find({}).select('_id name category')
    const updatedAt =userCv.updatedAt;
    const createdAt =userCv.createdAt;
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
     
    
    res.send({
        sections,
        adminRecommendationUpdatedAt: getLatestUpdate(recommendation),
        cvCreatedAt: createdAt,
        cvUpdatedAt:updatedAt
    })
  
  };
 
  function getLatestUpdate(datas){
    let updatedAt = '';
    datas.forEach((data, index)=>{
        updatedAt = updatedAt > data.updatedAt ? updatedAt:data.updatedAt
     })
     return updatedAt
  }


  const sendEmail = async (req, res)=>{
        try {
            let {userId} = req.body
            if(!userId){
                return res.status(400).json( { error: true,  msg: "enter user id"} )
            }
            let User = await user.findOne({_id: userId})
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'kalkidant05@gmail.com',
                    pass: 't05kalkidan'
                },
                connectionTimeout: 20000
            })
            
            const mailOptions = {
                from: 'kalkidant05@gmail.com',
                to: `${User.email}`,
                subject: 'From Cv Compiler: Your cv is ready. ',
                text: "Cv Compiler",
                html: `
                <html>
                <h3> hi ${User.firstName} Your cv is ready. </h3> 
                <a href = "www.google.com"> click here </a> to see your cv. 
                </html>
                `
            }
            
            
             transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return res.status(500).json( { error: true,  msg: error.message})
                }
                else{
                return res.json(
                        {status: true, msg: "email successfuly sent"}
                    )
                    // console.log("Email sent"+ info.response);
                }
            })
        } catch (error) {
            return res.json( { error: true,  msg: error.message})
         }
        }
    
  

module.exports = {
    getCv,
    addAllRecommendation,
    getUserCv,
    getDetailedUserCv,
    sendEmail
}