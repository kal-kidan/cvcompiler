const express = require("express");
const router = express.Router()
const authController = require('./../controllers/AuthController')
const {check} = require('express-validator')

router.post('/signup', [
    check('firstName').isAlpha().withMessage("enter valid name"),
    check('lastName').isAlpha().withMessage("enter valid name"),
    check('email').isEmail().withMessage("enter valid email"),
    check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
    check('password').isLength({min: 6}).withMessage("enter valid phone number"),
    check('role').isAlpha().withMessage("enter valid role"),
],authController.register)
router.post('/login', [
    check('email').not().isEmpty().withMessage("enter email"),
    check('password').not().isEmpty().withMessage("enter password"),
], authController.login)
module.exports = router