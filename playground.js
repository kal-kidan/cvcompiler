const { user } = require('./model/user')
const { cv } = require('./model/cv')
const { adminCv } = require('./model/adminCv')
const {mongoose} = require("./connect");

// const adminList = user.find({},{
//     skip:0, // Starting Row
//     limit:10, // Ending Row
//     sort:{
//         assignedCv: -1 //Sort by Date Added DESC
//     }
// },
// ['_id'], 
//  function(err, result){
//     if(err){
//         console.log("can not find your list of admins", err)
//         return
//     }
//     console.log(result)
// })

async function assignCv(){
    try{
      const admin = await user.find({role: "admin"}, null, { 
        skip:0, 
        limit:1, 
          sort:{
        assignedCv: 1
      } 
    })

    console.log(admin[0]._id)
  
      const newAdmin = new adminCv({
          adminId: admin[0]._id,
          cvId: '5f5c825477857618a1ae0d10'
      })
  
      const addedAdmin = await newAdmin.save()
      if(!addedAdmin){
        console.log("error saving assigned admin")
      }
      else{
          console.log(newAdmin)
      }
       
    }
    catch(error){
        console.log(error)
    }
    
  }

  assignCv()