const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const superAdminController = require('./../controllers/SuperAdminController')
const {check} = require('express-validator')

router.get('/admins', superAdminController.getAdmin)
router.delete('/admin/:adminId', superAdminController.deleteAdmin)

router.post('/admin/register', [
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"), 
],superAdminController.registerAdmin)

router.post('/section/add', [
check('name').not().isEmpty().isAlpha().withMessage("enter valid name"),
check('category').not().isEmpty().isAlpha().withMessage("enter valid category"),
],superAdminController.addSection)

router.delete('/section/:_id', superAdminController.deleteSection) 


module.exports = router