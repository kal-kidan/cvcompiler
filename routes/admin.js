const express = require('express')
const router = express.Router()
const auth = require('./../middleware/auth')
const adminController = require('./../controllers/adminController')
router.get('/assigned-cv', auth,adminController.getCv)
module.exports  = router