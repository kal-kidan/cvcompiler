const {educationShema,achievementSchema,workSchema,skillSchema,personalInfoSchema, referencesSchema} = require('./../lib/section-schema')
const Joi = require('joi')
const validateSchema = async (req, res, next)=>{
    try {
      const {sections} = req.body
      if(!Array.isArray(sections) || sections.length !== 6){
        throw new Error("invalid data")
      }
      const education = sections.filter((item)=> item.name.toLowerCase() === "education" )[0]
      const achievement = sections.filter((item)=> item.name.toLowerCase() === "achievement" )[0]
      const work = sections.filter((item)=> item.name.toLowerCase() === "work" )[0]
      const personalInfo = sections.filter((item)=> item.name.toLowerCase() === "personalinfo" )[0]
      const skill = sections.filter((item)=> item.name.toLowerCase() === "skills" )[0]
      const reference = sections.filter((item)=> item.name.toLowerCase() === "reference" )[0]
      if( !(education && achievement && work && personalInfo && skill && reference)){
        throw new Error("invalid data")
      }
      const educationError = await educationShema.validateAsync(education.description);
      const achievementError = await achievementSchema.validateAsync(achievement.description)   
      const workError = await workSchema.validateAsync(work.description) 
      const personalInfoError =  await personalInfoSchema.validateAsync(personalInfo.description)
      const skillError =  await skillSchema.validateAsync(skill.description)
      const referenceError = await referencesSchema.validateAsync(reference.description)
      next()
    } catch (error) {
      return res.status(400).json({error: true, msg: error.message})
    }
      
  }


module.exports = {
    validateSchema
}

 