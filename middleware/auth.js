const jwt = require('jsonwebtoken')
const {user} = require('./../model/user')

const auth = async (req, res, next) => {
    try {

         const token = req.header('Authorization').replace('Bearer ', '') 
         const decoded = jwt.verify(token, "mynode")  
         const {_id} = decoded 
         const User = await user.findOne({_id});  
        if(!User){
           return res.status(403).send({
               error:{
                   error: true,
                   msg: "please authenticate first"
               }
           })
        }

        req.user = User 
        req.token = token
        next()
    } catch (errors) {
        errors.msg = "you are not authorized"
        res.status(401).send({errors})
    
    }
   
}

module.exports = auth;