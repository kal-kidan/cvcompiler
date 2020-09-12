const express = require("express");
const router = express.Router()
const authController = require('./../controllers/AuthController')

router.post('/signup', authController.register)
router.post('/login', authController.login)
module.exports = router