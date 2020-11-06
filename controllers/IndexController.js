const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 

const me = async (req, res) => {
    return res.json({user: req.user})
}
const getSections = async (req, res)=>{ 
    try {
      let sections = await section.find({})
      res.json(sections)
    } catch (error) {
      return  res.status(500).json({
            error: true,
            msg: error.message
        })
    } 
}

module.exports = {
    me, getSections
}