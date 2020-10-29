const {check} = require('express-validator')
const signUp = [
  check('firstName').isAlpha().withMessage("enter valid name"),
  check('lastName').isAlpha().withMessage("enter valid name"),
  check('email').isEmail().withMessage("enter valid email"),
  check('phoneNumber').not().isEmpty().withMessage("enter valid phone number"),
  check('password').isLength({min: 6}).withMessage("enter valid password"),
  check('role').isAlpha().withMessage("enter valid role"),
]

const logIn = [
  check('email').not().isEmpty().withMessage("enter email"),
  check('password').not().isEmpty().withMessage("enter password"),
]
module.exports = {
  signUp, logIn
}