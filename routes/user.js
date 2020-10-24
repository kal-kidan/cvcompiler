const express = require("express")
const {check} = require('express-validator')
const router = express.Router()
const userController = require('./../controllers/UserController')
const {hasPermission} = require('./../middleware/authorization')

/**
 *  @swagger
 * 
 *  /user/upload/cv:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: upload cv pdf file
 *      requestBody:
 *        content: 
 *          multipart/form-data:  
 *            schema:
 *              type: object
 *              properties:
 *                cv:
 *                  type: file
 *                  required: true 
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 * 
 *     
 */
router.post('/upload/cv', hasPermission("uploadCv"), userController.uploadCv)


// router.get('/cvfile/:_id', userController.getCv)
/**
 *  @swagger
 * 
 *  /user/{_id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: update user info
 *      consumes:
 *        - application/json
 *      parameters: 
 *        - in: path
 *          name: _id
 *          schema: 
 *             type: string 
 *          required: true 
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
 
router.patch('/:_id',  hasPermission("updateUser"),[
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
    check('password').isLength({min: 6}).withMessage("enter valid password") 
], userController.updateUser)

/**
 *  @swagger
 * 
 *  /user/recommendation/{_id}:
 *    get:
 *      security:
 *        - bearerAuth: []
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
router.get('/recommendation/:_id', hasPermission("getRecommendation"), userController.getRecommendation)
/**
 *  @swagger
 * 
 *  /user/cv/{_id}:
 *    get:
 *      security:
 *        - bearerAuth: []
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
router.get('/cv/:_id' , hasPermission("getDetailedUserCv-user"), userController.getDetailedUserCv)
/**
 *  @swagger
 * 
 *  /user/recommendation/{cvId}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: edit recommendatins
 *      consumes:
 *        - application/json
 *      parameters: 
 *        - in: path
 *          name: cvId
 *          schema: 
 *             type: string 
 *          required: true 
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                sections:
 *                  type: Array 
 *              example:
 *                  sections: [{"sectionId": "5f7701422006ac70210b2b9e","description": "summary edited by the user"}]
 *      responses:
 *        200:
 *          description:  success message
 *        404: 
 *          description: cv not found
 *        400: 
 *          description: invalid cv id format
 */
router.patch('/recommendation/:cvId' , hasPermission("saveAll"), userController.saveAll)
module.exports = router