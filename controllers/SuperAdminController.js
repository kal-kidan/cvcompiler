
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
        user.paginate({role: "admin"}, { page, limit }, function(err, result) {
          return  res.send(result)
        });
    } catch (errors) {
        res.status(500).send({errors})
    }
      
 }
 
const deleteAdmin = async (req, res)=>{ 
    const superAdmin = req.user;
    try {
        const {adminId} = req.params   
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

const registerAdmin = async (req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).send(errors)
        return
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
        res.status(400).send({
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
    deleteSection
}