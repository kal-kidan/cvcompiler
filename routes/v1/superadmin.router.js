const express = require('express')
const router = express.Router() 
const {check} = require('express-validator')

const {hasPermission} = require('./../../middleware/authorization')
const superAdminController = require('./../../controllers/SuperAdminController')

router.get('/admins', hasPermission('getAdmin'),superAdminController.getAdmin)

router.delete('/admin/:adminId',hasPermission('deleteAdmin'), superAdminController.deleteAdmin)

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