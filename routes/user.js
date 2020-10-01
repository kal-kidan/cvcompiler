const express = require("express");
const router = express.Router()
const userController = require('./../controllers/UserController')
const auth = require('./../middleware/auth')
const multer =require('multer')
const path = require('path')
const helper = require('./../controllers/helper')
const {hashPassword} = require('./../middleware/hash_password')

router.post('/upload/cv', userController.uploadCv)
router.get('/cvfile', userController.getCv)
router.patch('/update', userController.updateUser)
router.get('/recommendation', userController.getRecommendation)
router.get('/cv', userController.getUserCv)
module.exports = router