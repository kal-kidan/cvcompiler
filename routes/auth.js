const express = require("express");
const router = express.Router()
const authController = require('./../controllers/AuthController')
const {check, validationResult} = require('express-validator')

router.post('/signup', [
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
    check('password').isLength({min: 6}).withMessage("enter valid phone number")
],authController.register)
router.post('/login', authController.login)
module.exports = router