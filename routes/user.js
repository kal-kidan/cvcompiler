const express = require("express");
const router = express.Router()
const userController = require('./../controllers/UserController')
const auth = require('./../middleware/auth')
const multer =require('multer')
const path = require('path')
const helper = require('./../controllers/helper')
const {hashPassword} = require('./../middleware/hash_password')

router.post('/upload/cv', auth, userController.uploadCv)
router.get('/cv',auth, userController.getCv)
router.patch('/update', auth, userController.updateUser)

module.exports = router