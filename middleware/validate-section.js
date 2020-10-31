const Joi = require('joi');
const section = require('../model/section');
const {educationShema,achievementSchema,workSchema,skillSchema,personalInfoSchema} = require('./../lib/section-schema')
const validateSection = (dataName) =>  async (req, res, next)=>{
    let sections
    if(dataName==="sections"){
        sections = req.body.sections
    }
    else if(dataName === "recommendation"){
       sections = req.body.recommendations
    }
    
    try {
        
        for(let section of sections){
            let {name} = section
            if(name.toLowerCase()==="education"){
                await educationShema.validateAsync(section.description)
            }
            if(name.toLowerCase()==="work"){
                await workSchema.validateAsync(section.description) 
            }
            if(name.toLowerCase()==="achievement"){
                await achievementSchema.validateAsync(section.description)   
            }
            if(name.toLowerCase()==="personalinfo"){
                await personalInfoSchema.validateAsync(section.description)
            }
            if(name.toLowerCase()==="skill"){
                await skillSchema.validateAsync(section.description)
            }
        }
       
      next()
    } catch (error) {
      return res.status(400).json({error: true, msg: error.message})
    }
      
  }

  module.exports = validateSection