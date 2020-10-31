const mongoose = require('./../lib/db-connect');
const {user} = require('./user');
 
const cvSchema = mongoose.Schema(
    {
     
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            unique: true,
            required: true
        },
        admin:{
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
                   type: Object, 
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
                    type: Object
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
                   type: Object, 
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
 