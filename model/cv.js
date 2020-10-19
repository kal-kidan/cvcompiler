const mongoose = require('./../lib/db-connect');
const {user} = require('./user');
 
const cvSchema = mongoose.Schema(
    {
        path: {
            type: String,
            required: true
        },
        user: {
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
                sectionId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'sections',
                    unique:true,
                    required: true
                } ,
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
                    unique:true,
                    required: true
                } ,
                 description:{
                   type: String, 
                   required: true
                 }
            }
           ],
           editedSections:[
            {
                sectionId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'sections',
                    unique:true,
                    required: true
                } ,
                 description:{
                   type: String, 
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
 