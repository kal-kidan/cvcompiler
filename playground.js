const { user } = require('./model/user')
const { cv } = require('./model/cv')
const { adminCv } = require('./model/adminCv')
const {mongoose} = require("./connect");

const adminList = user.find({},{
    skip:0, // Starting Row
    limit:10, // Ending Row
    sort:{
        assignedCv: -1 //Sort by Date Added DESC
    }
},
['_id'], 
 function(err, result){
    if(err){
        console.log("can not find your list of admins", err)
        return
    }
    console.log(result)
})