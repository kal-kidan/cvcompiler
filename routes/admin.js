const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')
const adminController = require('./../controllers/adminController')
router.get('/assigned-cv/:status', auth,adminController.getCv) 
// router.post('/addrecommendation', auth,adminController.addRecommendation) 
router.post('/addrecommendations', auth,adminController.addAllRecommendation) 
module.exports  = router