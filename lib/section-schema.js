const Joi = require('joi')
const linkSchema = Joi.object().required().keys({
    'type': Joi.string().trim().max(100).required(),
	'link': Joi.string().trim().max(100).required()
    })

const languageSchema =  Joi.object().required().keys({
    'type': Joi.string().trim().max(100).required(),
    'level': Joi.string().trim().max(100).required()
    })

const educationShema = Joi.array().required().items(
  Joi.object().required().keys({
    'degree': Joi.string().trim().max(100).required(),
    'field_of_study':Joi.string().trim().max(100).required(),
    'institute': Joi.string().trim().max(100).required(),
    'from': Joi.string().trim().max(100).required(),
    'to': Joi.string().trim().max(100).required(),
})
) 

const achievementSchema = Joi.array().items(
    Joi.string()
)	

const workSchema =  Joi.array().required().items(Joi.object().required().keys({
  'job_title': Joi.string().trim().max(100).required(),
  'employer':Joi.string().trim().max(100).required(),
  'description': Joi.string().trim().max(100).required(),
  'from': Joi.string().trim().max(100).required(),
  'to': Joi.string().trim().max(100).required()
})) 

const skillSchema =  Joi.object().required().keys({
    'language':  Joi.array().required().max(100).items(languageSchema),
    'soft_skill': Joi.array().required().max(100).items(Joi.string().trim().required()),
    'hard_skill': Joi.array().required().max(100).items(Joi.string().trim().required())
})

const referencesSchema =  Joi.array().required().items({
    'first_name':  Joi.string().trim().max(100).required(),
    'last_name':Joi.string().trim().max(100).required(),
    'company': Joi.string().trim().max(100).required(),
    'email': Joi.string().trim().max(100).required(),
    'phone': Joi.string().trim().max(100).required(),
    'profession': Joi.string().max(100).trim().required()
})


const personalInfoSchema = Joi.object().required().keys({
            'first_name': Joi.string().trim().max(100).required(),
			'last_name': Joi.string().trim().max(100).required(),
			'application_job_title': Joi.string().max(100).trim().required(),
			'phone': Joi.string().trim().max(100).required(),
			'email': Joi.string().trim().max(100).required(),
			'nationality': Joi.string().trim().max(100).required(),
			'country': Joi.string().trim().max(100).required(),
			'city': Joi.string().trim().max(100).required(),
            'postal_code': Joi.string().trim().max(100).required(),
            'personal_statement': Joi.string().trim().max(100).required(),
      'birth_date': Joi.string().trim().max(100).required(),
      'links':Joi.array().required().min(1).max(100).items( linkSchema)
})

module.exports = {
    educationShema,
    achievementSchema,
    workSchema,
    skillSchema,
    personalInfoSchema,
    referencesSchema
}