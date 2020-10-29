const express = require('express')
const {hasPermission} = require('./../../middleware/authorization')
const router = express.Router()
const adminController = require('./../../controllers/AdminController')
router.get('/assigned-cv/:status', hasPermission('getCv'),adminController.getCv) 
router.patch('/recommendation/:_id',hasPermission('addAllRecommendation'),adminController.addAllRecommendation) 
router.get('/cv/:_id',hasPermission('getUserCv'), adminController.getUserCv) 
router.get('/detailedcv/:_id', hasPermission('getDetailedUserCv-admin'),adminController.getDetailedUserCv) 
module.exports  = router