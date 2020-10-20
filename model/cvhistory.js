const mongoose = require('./../lib/db-connect');
const autoIncrement = require('mongoose-auto-increment');
const cvHistorySchema = mongoose.Schema(
    {
        cvId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cvs', 
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        },
        adminId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true 
        },
        version:{
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
            
        ] ,
    },
    {
        timestamps: true
    } 
)

 
const CvHistory = mongoose.model('cvhistory',cvHistorySchema);
cvHistorySchema.plugin(autoIncrement.plugin, { model: 'CvHistory', field: 'version' });
module.exports = {CvHistory};
 