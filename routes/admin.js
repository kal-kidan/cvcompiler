const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')
const adminController = require('./../controllers/adminController')
router.get('/assigned-cv/:status',adminController.getCv) 
router.post('/recommendation',adminController.addAllRecommendation) 
router.patch('/recommendation/:_id',adminController.updateRecommendation) 
module.exports  = router