const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 
const { CvHistory } = require("./../model/cvhistory"); 
const addHistory = async (req, res)=>{
   try {
    let history = req.body
    history.user = req.user._id
    const cv = await CvHistory.create(req.body)
    if(cv){
        cv.nextCount(function(err, count) {
            if(err){
                return res.json({error: true, msg: err.message})
            }
            return res.json({status: true, msg: "you have successfuly added cv history"}) 
        });
       
    } 
   } catch (error) {
    return res.status(400).json({
        error: true,
        msg: error.message
    })
   }
}
const getCvHistorys = async (req, res)=>{
  try {
    let {cvId} = req.params
     const historys = await CvHistory.find({cvId, user: req.user._id})
     const latestCv = await cv.findOne({user: req.user._id})
     if(!historys) return res.status(401).json({error: true, msg: "you have not the right privilege"})
     else return res.json({historys, latestCv: latestCv.uploadedSection})
  } catch (error) {
      res.status(400).json({error: true, msg: error.message})
  }
}

const getCvHistory = async (req,res)=>{
    try {
        let {historyId} = req.params
        let userId = req.user._id
        const history = await CvHistory.findOne({_id: historyId, user: userId})
        if(!history) return res.status(404).json({error: true, msg: "history not found"})
        else return res.json(history)
    } catch (error) {
        res.status(400).json({error: true, msg: error.message})
    }
}


const deleteCvHistory = async (req,res)=>{
    try {
        let {historyId} = req.params
        let userId = req.user._id
        const deletedHistory = await CvHistory.remove({_id: historyId, user: userId})
        if(!deletedHistory) return res.status(404).json({error: true, msg: "history not found"})
        else return res.json({status: true, msg: "cv history deleted successfuly"})
    } catch (error) {
        res.status(400).json({error: true, msg: error.message})
    }
}

module.exports = {
    addHistory,
    getCvHistory,
    getCvHistorys,
    deleteCvHistory
}