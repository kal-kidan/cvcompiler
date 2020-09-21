
const multer =require('multer')
const { validationResult, check } = require('express-validator'); 

const { user } = require('../model/user')
const { cv } = require('../model/cv')
const { adminCv } = require('../model/adminCv')
const {section} = require('./../model/section')

const url = require('url');

const getAdmin = async (req, res)=>{
    const superAdmin = req.user;   
    if(superAdmin.role=== "superAdmin"){ 
        const limit = parseInt(req.query.limit)  
        const skip = parseInt(req.query.skip)
         
        if( !(limit > 0 && skip >= 0) ) {  
           res.status(400).send(
               {
                   "errors":{
                       "msg": "invalid input"
                   }
               }
           )
           return
        }
        try { 
            const numberOfAdmins = await user.countDocuments({role: "admin"}) 
            const admins = await user.find({role: "admin"}, null, { skip: skip, limit: limit})
            const pageNumber = parseInt (skip/limit) + 1;
            const pages = Math.ceil(numberOfAdmins/limit) 
            const page = {pageNumber, pages}
            res.send({admins, page})
        } catch (errors) {
            res.status(500).send({errors})
        }
       
    }
    else{
        res.status(400).send({errors:{
            msg: "only super admin is privilleged to access this route"
        }})
    }
      
 }
 
const deleteAdmin = async (req, res)=>{ 
    const superAdmin = req.user;
    if(superAdmin.role === "superAdmin"){ 
        try {
            const {adminId} = req.query   
            const admin = await user.deleteOne({_id: adminId});
            const numberOfDeletedAdmins = admin.n
            if(numberOfDeletedAdmins===1){
                res.send({ 
                    status: true, 
                    msg: "the admin successfuly deleted"
                })  
            }
            else{
                res.status(404).send({
                    status: false, 
                    msg: "the admin id is not found"
                }) 
            }
          
        } catch (error) {
            const errors = {}
            errors.msg = "invalid admin id"
            res.status(400).send({errors})
        }
       
    }
    else{
        res.status(400).send({errors:{
            msg: "only super admin is privilleged to access this route"
        }})
    }
  
}

const registerAdmin = async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
    }
    const superAdmin = req.user;
    if(superAdmin.role === "superAdmin"){
        try {
            var body = req.body;
            var admin = new user(
                {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    email: body.email,
                    phoneNumber: body.phoneNumber,
                    password: "adminadmin",
                    role: "admin", 
                    assignedCv: 0
                }           
            );

            let savedAdmin = await admin.save()
            res.send({
                data: admin,
                status: true,
                msg: "admin registered successfuly"
            })
        } catch (error) {
            
            if(error.keyValue){
                if(error.keyValue.email){
                    let emailError  = {}
                    let errorArray = {errors:[]}
                    emailError.msg = 'this email has been taken'
                    emailError.param = 'email'
                    emailError.value = req.body.email
                    emailError.location = 'body'
                    errorArray.errors.push(emailError)
                    res.status(400).send(errorArray); 
                }  
            }

            else{
                res.status(500).send(error)
            }
          
            
        }
       
    }
    else{
        res.status(400).send({error:{
            msg: "only super admin is privilleged to access this route"
        }})
    }
}

//section 

const addSection = async (req, res)=>{
    let addedSection = req.body
    const errors = validationResult(addedSection)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
    }
     
    try {
      let savedSection = await section.create(addedSection)
      if(savedSection){
        res.send({
            status: true,
            msg: "section added successfuly"
        })
      }
    } catch (error) {
        res.status(500).send({
            error: true,
            msg: error.message
        })
    } 
}

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

const deleteSection = async(req, res)=>{
    let {_id} = req.params 
    try {
      let deletedSection = await section.findByIdAndRemove(_id) 
      if(!deletedSection){
         return res.status(404).send(
              {
                  errors: {
                    error: true,
                    msg: "section id not found"
                }
              }
          )
      }

      res.send({
          status: true,
          msg: "section deleted successfuly",
          section: deletedSection
      })

    } catch (error) {
        res.status(404).send({
            error: true,
            msg: error.message
        })
    } 
}

module.exports = {
    getAdmin,
    deleteAdmin,
    registerAdmin,
    addSection,
    getSections,
    deleteSection
}