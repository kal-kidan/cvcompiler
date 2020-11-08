const express = require('express')
const router = express.Router() 
const {check} = require('express-validator')

const {hasPermission} = require('./../../middleware/authorization')
const superAdminController = require('./../../controllers/SuperAdminController')

/**
 *  @swagger
 * 
 *  /v1/superadmin/admins:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - super admin
 *      description: get admins
 *      parameters: 
 *        - in: query
 *          name: page
 *          schema: 
 *             type: string 
 *          required: true 
 *        - in: query
 *          name: limit
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: array of registered admins
 *        400: 
 *          description: invalid page and limit
 * 
 *     
 */
router.get('/admins', hasPermission('getAdmin'),superAdminController.getAdmin)

/**
 *  @swagger
 * 
 *  /v1/superadmin/admin/{adminId}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - super admin
 *      description: delete admin
 *      parameters: 
 *        - in: path
 *          name: adminId
 *          schema: 
 *             type: string 
 *          required: true 
 *      responses:
 *        200:
 *          description: admin deleted successfuly
 *        404: 
 *          description: admin not found
 * 
 *     
 */

router.delete('/admin/:adminId',hasPermission('deleteAdmin'), superAdminController.deleteAdmin)

 /**
 *  @swagger
 * 
 *  /v1/superadmin/admin/register:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - super admin
 *      description: admin registration 
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  required: true   
 *                lastName:
 *                  type: string 
 *                  required: true 
 *                email:
 *                  type: string
 *                  required: true   
 *                phoneNumber:
 *                  type: string 
 *                  required: true 
 *      responses:
 *        200:
 *          description: Json containing added admin information
 *        400: 
 *          description: invalid data provided
 * 
 *     
 */

router.post('/admin/register', hasPermission('registerAdmin'), [
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"), 
], superAdminController.registerAdmin)

router.post('/section/add', hasPermission('addSection'), [
check('name').not().isEmpty().isAlpha().withMessage("enter valid name"),
check('category').not().isEmpty().isAlpha().withMessage("enter valid category"),
],superAdminController.addSection)

router.delete('/section/:_id', hasPermission('deleteSection'), superAdminController.deleteSection) 


module.exports = router