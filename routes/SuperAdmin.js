const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const superAdminController = require('./../controllers/SuperAdminController')
router.get('/get/admins', auth, superAdminController.getAdmin)
router.delete('/admin', auth, superAdminController.deleteAdmin)
router.post('/register/admin',auth,superAdminController.registerAdmin)

module.exports = router