const { user } = require('../model/user')
const { cv } = require('../model/cv') 
const { admin} = require('../routes/admin')

const getCv = async (req, res)=>{
    let admin = req.user
    let adminId = admin._id 
    let {status} = req.params
    if(status === "onprogress" || status === "new" || status === "sent"){
        try {
            const cvsAssigned = await cv.find({status,adminId})
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
    try {
        let {recommendation} = req.body
        let {userId} = req.body 
        let adminId = req.user._id
        let updatedCv = await cv.updateOne(
             {userId,adminId },
             { $addToSet: {recommendation} 
            }, 
             )
        if(updatedCv.nModified !== 1){
           return res.status(404).send({
                error: true,
                msg: "cv not found make sure you have the right privillege"
            })
        }
        updatedCv = await  cv.findOneAndUpdate({userId}, {status: "onprogress"}, {new: true})

        return res.send({
            status: true,
            msg: "you have successfully added recommendation",
            updatedData: updatedCv

        })
      
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: true,
            msg: error.messsage
        })
    }
}

const updateRecommendation = async (req, res)=>{
    try {
        let {_id} = req.params 
        let {description} = req.body 
        const query = {
        'recommendation._id': _id 
        };
        cv.findOne(query).then(doc => {
            recommendation = doc.recommendation.id(_id ); 
            recommendation["description"] =description;
            doc.save();
            return res.send({
                status: true,
                msg: "you have successfully added recommendation",
                updatedData: doc
    
            })
        }).catch(err => {
            res.send({
                error: true,
                msg: error.messsage
            })
        });
      
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: true,
            msg: error.messsage
        })
    }
}


const getUserCv = async (req, res) => {
    const { userId } = req.params
    let User = await user.findOne({_id:userId})
    const userCv = await cv.findOne({ userId }).select('_id status adminId createdAt updatedAt')
    if (!userCv) {
      return res.status(404).send({
        error: true,
        msg: "cv not found"
      })
     
    }
    res.send({
      userCv,
      user:User
    })
  
  };

  const getDetailedUserCv = async (req, res) => {
    const { userId } = req.params
    let User = await user.findOne({_id:userId})
    const userCv = await cv.findOne({ userId }).select('_id status adminId uploadedSection recommendation createdAt updatedAt')
    if (!userCv) {
      return res.status(404).send({
        error: true,
        msg: "cv not found"
      })
     
    }
    res.send({
      userCv,
      user:User
    })
  
  };
 

module.exports = {
    getCv,
    addAllRecommendation,
    updateRecommendation,
    getUserCv,
    getDetailedUserCv
}