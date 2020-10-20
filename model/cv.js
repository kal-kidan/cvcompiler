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
                 },
                 createdAt:{
                    type: Date,
                    default: Date.now()
                },
                updatedAt:{
                    type: Date,
                    default: Date.now()
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
                 },
                 createdAt:{
                    type: Date,
                    default: Date.now()
                },
                updatedAt:{
                    type: Date,
                    default: Date.now()
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
                 },
                 createdAt:{
                    type: Date,
                    default: Date.now()
                },
                updatedAt:{
                    type: Date,
                    default: Date.now()
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
 