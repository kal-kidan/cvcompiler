const bcrypt = require('bcryptjs');
const hashPassword = async (req,res,next)=>{
    const user = req.body;
    if(user){
        if(user.password){
            user.password = await bcrypt.hash(user.password, 8)
            next()
        }
    }

    next()
    
}

module.exports={
    hashPassword
}