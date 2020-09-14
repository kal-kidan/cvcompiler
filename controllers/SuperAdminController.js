
const multer =require('multer')
const { validationResult, check } = require('express-validator');
const { ObjectId } = require('mongoose');

const { user } = require('../model/user')
const { cv } = require('../model/cv')
const { adminCv } = require('../model/adminCv')
const {mongoose} = require("./../connect");

const url = require('url');

const getAdmin = async (req, res)=>{
    const superAdmin = req.user;   
    if(superAdmin.role=== "superAdmin"){ 
        const limit = parseInt(req.query.limit)  
        const skip = parseInt(req.query.skip)
         
        if( !(limit >= 0 && skip >= 0) ) {  
           res.status(400).send(
               {
                   "errors":{
                       "errMsg": "invalid input"
                   }
               }
           )
           return
        }
        try { 
            const admins = await user.find({role: "admin"}, null, { skip: skip, limit: limit})
            res.send({admins})
        } catch (errors) {
            res.status(500).send({errors})
        }
       
    }
    else{
        res.status(400).send({errors:{
            errMsg: "only super admin is privilleged to access this route"
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
                    message: "the admin successfuly deleted"
                })  
            }
            else{
                res.status(404).send({
                    status: false, 
                    errMsg: "the admin id is not found"
                }) 
            }
          
        } catch (error) {
            const errors = {}
            errors.errMsg = "invalid admin id"
            res.status(400).send({errors})
        }
       
    }
    else{
        res.status(400).send({errors:{
            errMsg: "only super admin is privilleged to access this route"
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
                message: "admin registered successfuly"
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
            errMsg: "only super admin is privilleged to access this route"
        }})
    }
}
module.exports = {
    getAdmin,
    deleteAdmin,
    registerAdmin
}