const express = require("express");
const router = express.Router()
const userController = require('./../controllers/UserController')
const auth = require('./../middleware/auth')
const multer =require('multer')
const path = require('path')
const helper = require('./../controllers/helper')
const {hashPassword} = require('./../middleware/hash_password')
const {check} = require('express-validator')
/**
 *  @swagger
 * 
 *  /user/upload/cv:
 *    post:
 *      tags:
 *        - user
 *      description: upload cv pdf file
 *      parameters: 
 *        - in: formdata
 *          name: cv
 *          schema: 
 *             type: file 
 *          required: true 
 *        - in: header 
 *          type: apiKey,
 *          name: Authorization
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 * 
 *     
 */
router.post('/upload/cv', userController.uploadCv)

/**
 *  @swagger
 * 
 *  /user/cvfile:
 *    get:
 *      tags:
 *        - user
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
 *  /recommendation:
 *    patch:
 *      tags:
 *        - user
 *      description: user registration (user, admin)
 *      consumes:
 *        - application/json
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string 
 *                lastName:
 *                  type: string
 *                email:
 *                  type: string 
 *                phoneNumber:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: success message
 *        400: 
 *          description: invalid data provided
 */
 
router.patch('/update',[
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
    check('password').isLength({min: 6}).withMessage("enter valid password") 
], userController.updateUser)

/**
 *  @swagger
 * 
 *  /user/recommendation:
 *    get:
 *      tags:
 *        - user
 *      description: get recommended data by admin
 *      parameters: 
 *        - in: path
 *          name: _id
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of object of sectionId, description and date
 *        404: 
 *          description: cv not found
 * 
 *     
 */
router.get('/recommendation', userController.getRecommendation)
/**
 *  @swagger
 * 
 *  /user/cv:
 *    get:
 *      tags:
 *        - user
 *      description: get user cv  
 *      parameters: 
 *        - in: path
 *          name: _id
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of object of sectionId, description and date
 *        404: 
 *          description: cv not found
 * 
 *     
 */
router.get('/cv/:_id', userController.getDetailedUserCv)
/**
 *  @swagger
 * 
 *  /recommendation:
 *    patch:
 *      tags:
 *        - user
 *      description: user registration (user, admin)
 *      consumes:
 *        - application/json
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                sections:
 *                  type: Array 
 *                cvId:
 *                  type: string
 *              example:
 *                  sections: []
 *                  cvId: "5f8e98dceebdde231804971c"
 *      responses:
 *        200:
 *          description:  A JSON object containing array of recommendations (sectionId, description)
 *        404: 
 *          description: cv not found
 *        400: 
 *          description: invalid cv id format
 */
router.patch('/recommendation', userController.saveAll)
module.exports = router