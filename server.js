const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express(); 
const unless = require('express-unless');

//models
const { user } = require('./model/user')
const { cv } = require('./model/cv'); 

//routes
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const superAdminRoute = require('./routes/SuperAdmin')
const adminRoute = require('./routes/admin')
const indexRoute = require('./routes/index')
const auth = require('./middleware/auth')
auth.unless = unless;

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(auth.unless({ path:['/auth/login', '/auth/signup'] }))

//routes
app.use('/',indexRoute) 
app.use('/auth',authRoute) 
app.use('/user', userRoute)
app.use('/superadmin', superAdminRoute )
app.use('/admin', adminRoute)

var port = process.env.port || 3000 ;
app.listen(3000, () => {
    console.log("the server started ...")
});