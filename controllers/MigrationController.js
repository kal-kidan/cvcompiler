const {section} = require('../model/section')
const {user} = require('../model/user')
const sections = [
    {
        name: "achievement",
        category: "cv"
    },
    {
        name: "education",
        category: "cv"
    },
    {
        name: "personalInfo",
        category: "cv"
    },
    {
        name: "reference",
        category: "cv"
    },
    
    {
        name: "skills",
        category: "cv"
    },
    {
        name: "work",
        category: "cv"
    }
  
]

const superAdminData = {
    firstName: "super",
    lastName: "admin",
    email: "superadmin@gmail.com",
    phoneNumber: "+251911334455",
    password: "superadmin",
    verified: true,
    role: "superAdmin"
}

const migrate = async (req, res)=>{
  
        try {
            for(let s of sections){
               let addedSection = new section(s)
               await addedSection.save()
            }
            const superAdmin = new user(
                superAdminData
            );
            
            await superAdmin.save()
            return res.json({status: true, msg: "migration went successfuly"})
        } catch (error) {
            return res.json({error: true, msg: "you have already migrated"})
        }
    
}

module.exports = {
    migrate
}