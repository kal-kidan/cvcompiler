const express = require("express")
const {check} = require('express-validator')
const router = express.Router()
const {hasPermission} = require('./../../middleware/authorization')
const userController = require('./../../controllers/UserController')
const CvHistoryController = require('./../../controllers/CvHistoryController')
const CvController = require('./../../controllers/CvController')
const {validateSchema} = require('./../../middleware/section-validator')
const validateSection = require('./../../middleware/validate-section')
/**
 *  @swagger
 * 
 *  /v1/user/cvsections:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: upload cv sections
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                sections:
 *                  type: array 
 *                  items: 
 *                    type: object  
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 * 
 *     
 */

router.post('/cvsections', hasPermission("uploadCv"), validateSchema, userController.addCv)

/**
 *  @swagger
 * 
 *  /v1/user/data/{_id}:
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
 
router.patch('/data/:_id',  hasPermission("updateUser"),[
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
    check('password').isLength({min: 6}).withMessage("enter valid password") 
], userController.updateUser);

/**
 *  @swagger
 * 
 *  /v1/user/recommendation/{_id}:
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
 *  /v1/user/cv/{_id}:
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
 *  /v1/user/cv/{_id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: upload cv sections
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
 *                sections:
 *                  type: array
 *                  required: true
 *                  items: 
 *                    type: object  
 *      responses:
 *        200:
 *          description: cv uploaded successfuly 
 *        400: 
 *          description: invalid file format only pdf files are allowed  
 *        404:
 *          description: id not found
 * 
 *     
 */

router.patch('/cv/:cvId' ,validateSection("sections"), hasPermission("saveAll"), userController.saveAll)

/**
 *  @swagger
 * 
 *  /v1/user/cv/upload/profileimage:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: upload cv sections
 *      requestBody:
 *        content: 
 *          multipart/form-data:  
 *            schema:
 *              type: object
 *              properties:
 *                cvprofile:
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
router.patch('/cv/upload/profileimage', CvController.uploadImage)

/**
 *  @swagger
 * 
 *  /v1/user/cvhistory/{historyId}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: get cv history
 *      parameters: 
 *        - in: path
 *          name: historyId
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: history object of a user
 *        404: 
 *          description: history not found
 * 
 *     
 */
router.get('/cvhistory/:historyId', CvHistoryController.getCvHistory)

/**
 *  @swagger
 * 
 *  /v1/user/cvhistorys/{userId}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: get cv history
 *      parameters: 
 *        - in: path
 *          name: userId
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of user historys
 *        404: 
 *          description: user not found
 * 
 *     
 */
router.get('/cvhistorys/:userId', CvHistoryController.getCvHistorys)

/**
 *  @swagger
 * 
 *  /v1/user/cvhistory/{historyId}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: get cv history
 *      parameters: 
 *        - in: path
 *          name: historyId
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of user historys
 *        404: 
 *          description: user not found
 * 
 *     
 */
router.delete('/cvhistory/:historyId', CvHistoryController.deleteCvHistory)

/**
 *  @swagger
 * 
 *  /v1/user/cvhistory:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: upload cv sections
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                cv:
 *                  type:
 *                    string
 *                  required: true   
 *                sections:
 *                  type: array 
 *                  items: 
 *                    type: object  
 *      responses:
 *        200:
 *          description: cv history uploaded successfuly 
 *        404: 
 *          description: history not found
 * 
 *     
 */
router.post('/cvhistory', validateSchema, CvHistoryController.addHistory)


/**
 *  @swagger
 * 
 *  /v1/user/iscvuploaded:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - user
 *      description: check if the user has uploaded cv
 *      responses:
 *        200:
 *          description: object containing status and message
 *    
 */
router.get('/iscvuploaded',CvController.isCvUploaded)

module.exports = router