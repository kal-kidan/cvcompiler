const { user } = require('../model/user')
const { cv } = require('../model/cv') 
const { section } = require('../model/section') 

const getCv = async (req, res)=>{
    let admin = req.user
    let adminId = admin._id 
    let {status} = req.params
    if(status === "onprogress" || status === "new" || status === "sent"){
        try {
            const cvsAssigned = await cv.find({status,adminId}).select('_id user').populate('user')
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

const addAllRecommendation = async (req, res)=>{
    let {recommendations} = req.body
    let cvId = req.body.cvId 
    let adminId = req.user._id
    try {
        let cvAdmin = await cv.findOne({_id:cvId, adminId})
        if(!cvAdmin ){
            return res.status(404).send({
                 error: true,
                 msg: "cv not found"
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

    for(let i=0;i<recommendations.length;i++){
            let recommendation = recommendations[i]
            const query = {
            'recommendation.sectionId': recommendation.sectionId 
            }
            cv.findOne(query).then(doc => {
                if(doc){
                    updateRecommendation(req,res,doc,recommendation)
                }
                else{
                   addRecommendation(req,res,recommendation,cvId)     
                }
            }).catch(err => {
               return res.status(500).send({
                    error: true,
                    msg: err.messsage
                })
                console.log(err)
            });
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
            {_id:cvId,adminId },
            { $addToSet: {recommendation} }, 
                )
        let updatedCv = await  cv.findOneAndUpdate({_id:cvId}, {status: "onprogress"}, {new: true})

    } catch (error) {
        console.log("from add recommendation", error);
        return res.status(500).send({
            error: true,
            msg: error.messsage
        })
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
       console.log("from update recommendation",error)
       return res.status(500).send({
            error: true,
            msg: error.messsage
        })
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
    const {uploadedSection} = userCv
    const dbsections = await section.find({}).select('_id name category')
     uploadedSection.forEach((uploadedSection, index)=>{
         if(!recommendation[index]){
            recommendation[index] = ''
         }
         
         let sectionId = uploadedSection.sectionId
         let section = dbsections[index]
         sections.push({sectionId, section,uploaded: uploadedSection.description, recommended: recommendation[index]})
     })
    res.send({
        sections 
    })
  
  };
 

module.exports = {
    getCv,
    addAllRecommendation,
    getUserCv,
    getDetailedUserCv
}