const {mongoose} = require('./../connect');
const {user} = require('./../model/user')
const superAdminData = {
    firstName: "super",
    lastName: "admin",
    email: "superadmin@gmail.com",
    phoneNumber: "+251911334455",
    password: "superadmin",
    role: "superAdmin"
}

const superAdmin = new user(
    superAdminData
)

superAdmin.save((err, result)=>{
        if(err){
            console.log("error occured while seeding super admin data\n", err)
            return
        }
        console.log("super admin sucessfuly registerd")
        mongoose.disconnect()

})