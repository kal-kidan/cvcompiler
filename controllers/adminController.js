const { user } = require('../model/user')
const { cv } = require('../model/cv') 

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
        let updatedCv = await cv.updateOne(
             {userId},
             { $addToSet: {recommendation} }, 
             )
        if(updatedCv.nModified !== 1){
           return res.status(404).send({
                error: true,
                msg: "cv not found"
            })
        }
        updatedCv = await  cv.findOneAndUpdate({userId}, {status: "onprogress"}, {new: true})

        return res.send({
            status: true,
            msg: "you have successfully add recommendation",
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

// const updateRecommendation = async (req, res)=>{
//     try {
//         let {recommendation} = req.body     
//         let {_id} = recommendation   
//         let {userId} = req.body   
//         // let updatedCv = await cv.findOneAndUpdate({userId}, {recommedation}, {new: true})
//         let Cv = await cv.findOne({userId})   
//         Cv.recommendation.description =  recommendation.description
//         let updatedCv = await Cv.save()
//         if(!updatedCv){
//            return res.status(404).send({
//                 error: true,
//                 msg: "cv not found"
//             })
//         }
//         return res.send({
//             status: true,
//             msg: "you have successfully add recommendation",
//             updatedData: updatedCv

//         })
      
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             error: true,
//             msg: error.messsage
//         })
//     }
// }



 

module.exports = {
    getCv,
    addAllRecommendation
}