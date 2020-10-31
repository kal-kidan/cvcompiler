const {check, body, validationResult} = require('express-validator')
 
const signUp = [
  check('firstName').isAlpha().withMessage("enter valid name"),
  check('lastName').isAlpha().withMessage("enter valid name"),
  check('email').isEmail().withMessage("enter valid email"),
  check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
  check('password').isLength({min: 6}).withMessage("enter valid password"),
  check('role').isAlpha().withMessage("enter valid role"),
]

const logIn = [
  check('email').not().isEmpty().withMessage("enter email"),
  check('password').not().isEmpty().withMessage("enter password"),
]
 
function getSectionValidation(section){
  if(section.toLowerCase() === "education"){
    return [
      check('degree').isAlpha().withMessage("enter valid degree"),
      check('from').isAlpha().withMessage("enter valid date"),
      check('to').isAlpha().withMessage("enter valid date"),
      check('institute').isAlpha().withMessage("enter valid institute"),
      check('field_of_study').isAlpha().withMessage("enter valid institute")
    ]
  }

  else if (section.toLowerCase() === "work"){
    return [
      check('job_title').isAlpha().withMessage("enter valid job title"),
      check('to').isAlpha().withMessage("enter valid date"),
      check('from').isAlpha().withMessage("enter valid date"),
      check('description').isAlpha().withMessage("enter valid description"),
      check('employer').isAlpha().withMessage("enter valid employer")
    ]
  }

  else if (section.toLowerCase() === "personal_info"){
    return [
      check('first_name').isAlpha().withMessage("enter valid first name"),
      check('last_name').isAlpha().withMessage("enter valid last name"),
      check('application_job_title').isAlpha().withMessage("enter valid application job title"),
      check('phone').isAlpha().withMessage("enter valid phone number"),
      check('email').isAlpha().withMessage("enter valid email"),
      check('nationality').isAlpha().withMessage("enter valid nationality"),
      check('country').isAlpha().withMessage("enter valid country"),
      check('city').isAlpha().withMessage("enter valid application city"),
      check('postal_code').isAlpha().withMessage("enter valid postal code"),
      check('birth_date').isAlpha().withMessage("enter valid birth date"),
      check('links').custom((value)=>{
        if(Array.isArray(value) && !value.isEmpty()){
          let isValid = value.every((item)=>{
            if(typeof item === 'Object' && typeof item.type === "string" && typeof item.link === "string"){
              return true
            }
            else{
              return false
            }
             
          })

          if(!isValid){
              throw new Error("invalid links")
          }
          else{
             return true
          }
        }

        else{
          throw new Error("invalid links")
        }
      }),
      
    ]
     
}
else if(section.toLowerCase() === "achievements"){
  return [
    check('achievement').isArray()
  ]
}

else if(section.toLowerCase() === "skills"){
  return [
    check('skills').custom((value)=>{
      if(value.hasProperty('language') && value.hasProperty('soft_skill') && value.hasProperty('hard_skill')){
        if(Array.isArray(value.language) && Array.isArray(value.soft_skill) && Array.isArray(value.hard_skill)){
           let isValidLanguage = value.language.every((language)=>{
            if(language.hasProperty('type') && language.hasProperty('level')){
              if(typeof language.type === "string" && typeof language.level === "string"){
                return true
              }
              else{

              }
            }
            else{
              return false
            }
           })
           
           let isValidSoftSkill = value.soft_skill.every((softSkill)=>{
             if(typeof softSkill === "string"){
               return true
             }
             return false
           })

           let isValidHardSkill = value.hard_skill.every((hardSkill)=>{
            if(typeof hardSkill === "string"){
              return true
            }
            return false
          })

           if(isValidLanguage && isValidSoftSkill && isValidHardSkill){
              return true
           }
           else{
             throw new Error("invalid skills")
           }
        }
        else{
          throw new Error("invalid skills")
        }
      }
      else{
        throw new Error("invalid skills")
      }
    })
  ]
}
}

const result = validationResult(getSectionValidation("education"))

module.exports = {
  signUp, logIn, getSectionValidation
}
