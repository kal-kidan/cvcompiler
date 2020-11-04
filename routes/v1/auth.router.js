const express = require("express");
const router = express.Router()
const {hasPermission} = require('./../../middleware/authorization')
const authController = require('./../../controllers/AuthController')
const {check} = require('express-validator')
const validate = require('./../../middleware/form-validator')
/**
 *  @swagger
 * 
 *  /auth/signup:
 *    post:
 *      tags:
 *        - auth
 *      description: user registration (user, admin)
 *      consumes:
 *        - application/json
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string 
 *                lastName:
 *                  type: string
 *                email:
 *                  type: string 
 *                phoneNumber:
 *                  type: string 
 *                password:
 *                  type: string 
 *                role:
 *                  type: string 
 *              example:
 *                  firstName: "abebe"
 *                  lastName: "kebede"
 *                  email: "abebe@gmail.com"
 *                  password: "password"
 *                  phoneNumber: "+251942793296"
 *                  role: "user"
 *   
 *      responses:
 *        200:
 *          description:  A JSON object containing user information
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  email:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *        401: 
 *          description: incorrect username or password 
 *  
 *     
 */

router.post('/signup',  validate.signUp,authController.register)


/**
 *  @swagger
 * 
 *  /auth/login:
 *    post:
 *      tags:
 *        - auth
 *      description: login
 *      consumes:
 *        - application/json
 *      requestBody:
 *        content: 
 *          application/json:  
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string 
 *                password:
 *                  type: string
 *              example:
 *                email: abebe@gmail.com
 *                pasword: abebe1             
 *      responses:
 *        200:
 *          description:  A JSON object containing user information
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  firstName:
 *                    type: string
 *                  lastName:
 *                    type: string
 *                  email:
 *                    type: string
 *                  phoneNumber:
 *                    type: string
 *                example:
 *                  _id: "5f8b08697e7d8b339c28e320"
 *                  firstName: "abebe"
 *                  lastName: "kebede"
 *                  email: "abebe@gmail.com"
 *                  phoneNumber: "+251942793296"
 *                  role: "user"
 *         
 *        401: 
 *          description: incorrect username or password 
 *  
 *     
 */
router.post('/login', validate.logIn, authController.login)

router.post('/verify',authController.verifyEmail)

router.post('/forgotpassword',authController.forgotPassword)
router.post('/resetpassword',authController.resetPassword)
module.exports = router