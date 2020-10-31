const Joi = require('joi')
const linkSchema = Joi.object().required().keys({
    'type': Joi.string().trim().required(),
	'link': Joi.string().trim().required()
    })

const languageSchema =  Joi.object().required().keys({
    'type': Joi.string().trim().required(),
    'level': Joi.string().trim().required()
    })

const educationShema = Joi.array().required().items(
  Joi.object().required().keys({
    'degree': Joi.string().trim().required(),
    'field_of_study':Joi.string().trim().required(),
    'institute': Joi.string().trim().required(),
    'from': Joi.string().trim().required(),
    'to': Joi.string().trim().required(),
})
) 

const achievementSchema = Joi.array().items(
    Joi.string()
)	

const workSchema =  Joi.array().required().items(Joi.object().required().keys({
  'job_title': Joi.string().trim().required(),
  'employer':Joi.string().trim().required(),
  'description': Joi.string().trim().required(),
  'from': Joi.string().trim().required(),
  'to': Joi.string().trim().required()
})) 

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

module.exports = {
    educationShema,
    achievementSchema,
    workSchema,
    skillSchema,
    personalInfoSchema
}