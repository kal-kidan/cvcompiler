const express = require("express");
const router = express.Router()
const {hasPermission} = require('./../../middleware/authorization')
const IndexController = require('./../../controllers/IndexController')
 
router.get('/sections', IndexController.getSections)
router.get('/user/me', IndexController.me)
module.exports = router