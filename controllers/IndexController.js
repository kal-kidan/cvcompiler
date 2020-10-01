const { user } = require("./../model/user");
const { cv } = require("./../model/cv"); 
const { section } = require("./../model/section"); 
const getSections = async (req, res)=>{ 
    try {
      let sections = await section.find({})
      res.json(sections)
    } catch (error) {
        res.status(500).send({
            error: true,
            msg: error.message
        })
    } 
}

module.exports = {
    getSections
}