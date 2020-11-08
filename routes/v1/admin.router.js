const express = require('express')
const {hasPermission} = require('./../../middleware/authorization')
const router = express.Router()
const adminController = require('./../../controllers/AdminController')
const validateSection = require('./../../middleware/validate-section')

/**
 *  @swagger
 * 
 *  /v1/admin/assigned-cv/{status}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - admin
 *      description: assigned user cvs
 *      parameters: 
 *        - in: path
 *          name: status
 *          schema: 
 *            type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of object of user cvs
 *        404: 
 *          description: path not found
 * 
 */
router.get('/assigned-cv/:status', hasPermission('getCv'),adminController.getCv) 

/**
 *  @swagger
 * 
 *  /v1/admin/recommendation/{_id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - admin
 *      description: edit admin recommendation
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
 *                recommendations:
 *                  type: array
 *                  required: true
 *                  items:
 *                    type: object     
 *      responses:
 *        200:
 *          description: success message
 *        400: 
 *          description: invalid data provided
 *        404:
 *          description: cv not found
 */
router.patch('/recommendation/:_id',hasPermission('addAllRecommendation'),validateSection("recommendation"),adminController.addAllRecommendation) 

/**
 *  @swagger
 * 
 *  /v1/admin/cv/{_id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - admin
 *      description: return user cv
 *      parameters: 
 *        - in: path
 *          name: _id
 *          schema: 
 *            type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: object of user cv
 *        404: 
 *          description: cv not found
 * 
 */
router.get('/cv/:_id',hasPermission('getUserCv'), adminController.getUserCv) 

/**
 *  @swagger
 * 
 *  /v1/admin/detailedcv/{_id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - admin
 *      description: assigned user cvs
 *      parameters: 
 *        - in: path
 *          name: _id
 *          schema: 
 *            type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: detail of user cv
 *        404: 
 *          description: cv not found
 * 
 */
router.get('/detailedcv/:_id', hasPermission('getDetailedUserCv-admin'),adminController.getDetailedUserCv) 

/**
 *  @swagger
 * 
 *  /v1/admin/emailrecommendation:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - admin
 *      description: send email
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                userId:
 *                  type: string
 *                  required: true 
 * 
 *      responses:
 *        200:
 *          description: email sent successfuly 
 *        404: 
 *          description: user not found
 * 
 *     
 */
router.post('/emailrecommendation', hasPermission('sendEmail'),adminController.sendEmail) 
module.exports  = router