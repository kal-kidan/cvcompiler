const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')
const adminController = require('./../controllers/adminController')
router.get('/assigned-cv/:status',adminController.getCv) 
router.patch('/recommendation/:_id',adminController.addAllRecommendation) 
router.get('/cv/:_id', adminController.getUserCv) 
router.get('/detailedcv/:_id', adminController.getDetailedUserCv) 
module.exports  = router