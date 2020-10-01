const mongoose = require('./../lib/db-connect');
const {user} = require('./user');
const cvSchema = mongoose.Schema(
    {
        path: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            unique: true,
            required: true
        },
        adminId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users' 
        },
        status:{
            type: String,
            default: 'new'
          },
        uploadedSection:[
            {
                name:{
                   type: String,  
                 },
                 description:{
                   type: String, 
                 }
            }
        ],
        recommendation:[
         
            {
                sectionId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'sections',
                    required: true
                } ,
                 description:{
                   type: String, 
                   required: true
                 }
            }
           ],
    } ,
    {
        timestamps: true
    }
    
    
)
const cv = mongoose.model('cv',cvSchema);

module.exports = {cv};
 