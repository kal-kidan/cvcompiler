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

router.post('/addsection', [
check('tittle').isAlpha().withMessage("enter valid tittle"),
check('category').isAlpha().withMessage("enter valid category"),
], auth,superAdminController.addSection)

router.delete('/section/:_id', auth, superAdminController.deleteSection)
router.get('/sections', auth, superAdminController.getSections)
router.get('/addsection', auth, superAdminController.addSection)

module.exports = router