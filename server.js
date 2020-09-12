const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

//models
const { user } = require('./model/user')
const { cv } = require('./model/cv');
const { adminCv } = require('./model/adminCv');

//routes
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const superAdminRoute = require('./routes/SuperAdmin')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/auth',authRoute) 
app.use('/user', userRoute)
app.use('/super', superAdminRoute )

var port = process.env.port || 3000 ;
app.listen(3000, () => {
    console.log("the server started ...")
});