const express = require("express");
const router = express.Router()
const userController = require('./../controllers/UserController')
const auth = require('./../middleware/auth')
const multer =require('multer')
const path = require('path')
const helper = require('./../controllers/helper')
const {hashPassword} = require('./../middleware/hash_password')

/**
 *  @swagger
 * 
 *  /user/upload/cv:
 *    post:
 *      description: upload cv pdf file
 *      parameters: 
 *        - in: formdata
 *          name: cv
 *          schema: 
 *             type: file 
 *          required: true 
 *        - in: header
 *          description: authorization token
 *          name: authorization
 *          type: string
 *          required: true     
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 *     
 */
router.post('/upload/cv', userController.uploadCv)

/**
 *  @swagger
 * 
 *  /user/cvfile:
 *    get:
 *      description: return the pdf file uploaded by user 
 *      responses:
 *        200:
 *          description: pdf file returned
 *        400: 
 *          description: user hasn't upload cv  
 *     
 */
router.get('/cvfile', userController.getCv)

/**
 *  @swagger
 * 
 *  /user/update:
 *    patch:
 *      description: update user info
 *      parameters: 
 *        - in: body
 *          name: firstName
 *          schema: 
 *             type: string 
 *        - in: body
 *          name: lastName
 *          schema: 
 *             type: string 
 *        - in: body
 *          name: email
 *          schema: 
 *             type: string 
 *        - in: body
 *          name: phoneNumber
 *          schema: 
 *             type: string 
 *        - in: body
 *          name: password
 *          schema: 
 *             type: string 
 *        - in: header
 *          description: authorization token
 *          name: authorization
 *          type: string
 *          required: true     
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 *     
 */
router.patch('/update', userController.updateUser)
router.get('/recommendation', userController.getRecommendation)
router.get('/cv/:userId', userController.getDetailedUserCv)
router.patch('/recommendation/:sectionId', userController.updateRecommendation)
module.exports = router