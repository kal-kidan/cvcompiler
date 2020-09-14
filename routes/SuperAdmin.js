const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const superAdminController = require('./../controllers/SuperAdminController')
const {check, validationResult} = require('express-validator')

router.get('/get/admins', auth, superAdminController.getAdmin)
router.delete('/admin', auth, superAdminController.deleteAdmin)
router.post('/register/admin', [
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"), 
],auth,superAdminController.registerAdmin)

module.exports = router