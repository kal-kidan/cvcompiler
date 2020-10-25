//require('dotenv/config')
console.log(process.env.TOKEN_KEY);
const express = require("express");
const mongoose = require("mongoose");
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const cors = require('cors');
const bodyParser = require('body-parser')
const app = express(); 
const unless = require('express-unless');

//models
const { user } = require('./model/user')
const { cv } = require('./model/cv'); 

//https://swagger.io/specification/#infoObject
const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        components:{
            securitySchemes: {
                ApiKeyAuth:{
                    type: "apiKey",
                    in: "header",
                    name: "Authorization"
                  }
            }
        }    ,
        
        security: {
            ApiKeyAuth: []
        }
        
        },
    info: {
        title: "Cv Compiler API",
        version: "1.0.0",
        description: "cv compiler descripton",
        contact: {
            name: "kalkidan",
            email: "kal05627356@gmail.com"
        }
    },
     
    apis: [ './routes/auth.js', './routes/user.js', './routes/admin.js' , './routes/SuperAdmin.js', './routes/index.js'],
 
}

const swaggerDoc = swaggerJSDoc(
    swaggerOptions
)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

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
//app.use(auth.unless({ path:['/auth/login', '/auth/signup'] }))

 
app.use('/',indexRoute) 
app.use('/auth',authRoute) 
app.use('/user', userRoute)
app.use('/superadmin', superAdminRoute )
app.use('/admin', adminRoute)

var port = process.env.port || 3000 ;
app.listen(3000, () => {
    console.log("the server started ...")
});