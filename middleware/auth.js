const jwt = require('jsonwebtoken')
const {user} = require('./../model/user')

const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '') 
         const verify = jwt.verify(token, "mynode")  
         const id = verify._id 
         const usere = await user.findOne({_id: id, 'tokens.token': token});  
        if(!usere){
           return res.status(403).send("please authenticate first")
        }

        req.user = usere;
        req.token = token;
        next();
    } catch (errors) {
        errors.errMsg = "you are not authorized"
        res.status(401).send({errors})
    
    }
   
}

module.exports = auth;