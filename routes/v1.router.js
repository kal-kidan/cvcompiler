const express = require('express')
const router = express.Router()
const authRoute = require('./v1/auth.router')
const userRoute = require('./v1/user.router')
const superAdminRoute = require('./v1/superadmin.router')
const adminRoute = require('./v1/admin.router')
const indexRoute = require('./v1/index.router') 

router.use('/common', indexRoute) 
router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/admin', adminRoute)
router.use('/superadmin', superAdminRoute)


module.exports = router