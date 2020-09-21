const { user } = require('../model/user')
const { cv } = require('../model/cv')
const { adminCv } = require('../model/adminCv')

const getCv = async (req, res)=>{
    let admin = req.user
    let adminId = admin._id 
    let {status} = req.params
  
    try {
        const cvsAssigned = await adminCv.find({status})
        const listOfAssignedCvs = []
        for(let adminCv of cvsAssigned){
            let {cvId} = adminCv
           
            let cvOne = await cv.findOne({_id: cvId})
            let {userId} = cvOne
            
            let userOne = await user.findOne({_id: userId})
            let modifiedUser = {firstName: userOne.firstName, lastName: userOne.lastName, email: userOne.email,phoneNumber:userOne.phoneNumber}
            const user_cv = {user:modifiedUser, cv:cvOne}
            listOfAssignedCvs.push(user_cv)
        }
        res.send(listOfAssignedCvs)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

 

module.exports = {
    getCv
}