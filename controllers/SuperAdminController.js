
const multer =require('multer')
const { validationResult } = require('express-validator')

const { user } = require('../model/user') 
const {section} = require('./../model/section')

const url = require('url');

const getAdmin = async (req, res)=>{ 
    const superAdmin = req.user;   
    const limit = parseInt(req.query.limit)  
    const page = parseInt(req.query.page)
    if( !(limit > 0 && page > 0) ) {  
       return res.status(400).json(
           {
               "errors":{
                   "msg": "invalid input"
               }
           }
       )
       return
    }
    try { 
        user.paginate({role: "admin"}, { page, limit }, function(err, result) {
          return  res.json(result)
        });
    } catch (errors) {
       return res.status(500).json({errors})
    }
      
 }
 
const deleteAdmin = async (req, res)=>{ 
    const superAdmin = req.user;
    try {
        const {adminId} = req.params   
        const admin = await user.deleteOne({_id: adminId});
        const numberOfDeletedAdmins = admin.n
        if(numberOfDeletedAdmins===1){
            return res.json({ 
                status: true, 
                msg: "the admin successfuly deleted"
            })  
        }
        else{
           return res.status(404).json({
                status: false, 
                msg: "the admin id is not found"
            }) 
        }
      
    } catch (error) {
        const errors = {}
        errors.msg = "invalid admin id"
        return res.status(400).json({errors})
    }
  
}

const registerAdmin = async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors) 
    }
    const superAdmin = req.user;
    try {
        var body = req.body;
        var admin = new user(
            {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phoneNumber: body.phoneNumber,
                password: "adminadmin",
                verified: true,
                role: "admin", 
                assignedCv: 0
            }           
        );

        let savedAdmin = await admin.save()
        return res.json({
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
               return  res.status(400).send(errorArray); 
            }  
        }

        else{
           return res.status(500).send(error)
        }
      
        
    }
}

//section 

const addSection = async (req, res)=>{
    let addedSection = req.body
    const errors = validationResult(addedSection)
    if(!errors.isEmpty()){
        return res.status(400).send(errors)
    }
     
    try {
      let savedSection = await section.create(addedSection) 
      if(savedSection){
        return res.json({
            status: true,
            msg: "section added successfuly"
        })
      }
    } catch (error) {
       return res.status(400).json({
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
         return res.status(404).json(
              {
                  errors: {
                    error: true,
                    msg: "section id not found"
                }
              }
          )
      }

      return res.json({
          status: true,
          msg: "section deleted successfuly",
          section: deletedSection
      })

    } catch (error) {
        return res.status(404).json({
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
    deleteSection
}