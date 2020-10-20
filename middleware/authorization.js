const {userPermissions} = require('./../lib/permission')
const {adminPermisions} = require('./../lib/permission')
const {superAdminPermisions} = require('./../lib/permission')
exports.hasPermission = (permission) =>(req, res,next)=> {
   try {
    if (req.user.role === "user") {
        if(!userPermissions.includes(permission)){
            throw new Error('You dont have the right privilege ')
        }
        next();
    }
    else if(req.user.role === "admin"){
        if(!adminPermisions.includes(permission)){
            throw new Error('You dont have the right privilege ')
        }
        next();
    }
    else if(req.user.role === "superAdmin"){ 
        if(!superAdminPermisions.includes(permission)){
            throw new Error('You dont have the right privilege ')
        }
        next();
    }
   } catch (error) {
        res.status(401).json({
            error: true,
            message: error.message
        })
   }
}

