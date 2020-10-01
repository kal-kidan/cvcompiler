const express = require("express");
const router = express.Router()
const IndexController = require('./../controllers/IndexController')
 
router.get('/sections', IndexController.getSections)
module.exports = router