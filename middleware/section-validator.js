const Joi = require('joi')
const linkSchema = Joi.object().required().keys({
    'type': Joi.string().trim().required(),
	'link': Joi.string().trim().required()
    })

const languageSchema =  Joi.object().required().keys({
    'type': Joi.string().trim().required(),
    'level': Joi.string().trim().required()
    })

const educationShema = Joi.object().required().keys({
        'degree': Joi.string().trim().required(),
        'field_of_study':Joi.string().trim().required(),
        'institute': Joi.string().trim().required(),
        'from': Joi.string().trim().required(),
        'to': Joi.string().trim().required(),
})

const achievementSchema = Joi.array().items(
    Joi.string()
)	

const workSchema =  Joi.object().required().keys({
    'job_title': Joi.string().trim().required(),
    'employer':Joi.string().trim().required(),
    'description': Joi.string().trim().required(),
    'from': Joi.string().trim().required(),
    'to': Joi.string().trim().required()
})

const skillSchema =  Joi.object().required().keys({
    'language':  Joi.array().required().items(languageSchema),
    'soft_skill': Joi.array().required().items(Joi.string().trim().required()),
    'hard_skill': Joi.array().required().items(Joi.string().trim().required())
})


const personalInfoSchema = Joi.object().required().keys({
            'first_name': Joi.string().trim().required(),
			'last_name': Joi.string().trim().required(),
			'application_job_title': Joi.string().trim().required(),
			'phone': Joi.string().trim().required(),
			'email': Joi.string().trim().required(),
			'nationality': Joi.string().trim().required(),
			'country': Joi.string().trim().required(),
			'city': Joi.string().trim().required(),
			'postal_code': Joi.string().trim().required(),
            'birth_date': Joi.string().trim().required(),
            'links':Joi.array().required().min(1).items( linkSchema)
})


const validateSchema = async (req, res, next)=>{
    try {
      const {sections} = req.body
      if(!Array.isArray(sections) ||  sections.length === 0){
        throw new Error("invalid data")
      }
      const education = sections.filter((item)=> item.name.toLowerCase() === "education" )[0]
      const achievement = sections.filter((item)=> item.name.toLowerCase() === "achievement" )[0]
      const work = sections.filter((item)=> item.name.toLowerCase() === "work" )[0]
      const personalInfo = sections.filter((item)=> item.name.toLowerCase() === "personalinfo" )[0]
      const skill = sections.filter((item)=> item.name.toLowerCase() === "skill" )[0]
      if( !(education && achievement && work && personalInfo && skill) ){
        throw new Error("invalid data")
      }
      const educationError = await educationShema.validateAsync(education.description);
      const achievementError = await achievementSchema.validateAsync(achievement.description)   
      const workError = await workSchema.validateAsync(work.description) 
      const personalInfoError =  await personalInfoSchema.validateAsync(personalInfo.description)
      const skillError =  await skillSchema.validateAsync(skill.description)
      next()
    } catch (error) {
      return res.json({error: true, msg: error.message})
    }
      
  }


module.exports = {
    validateSchema
}

 