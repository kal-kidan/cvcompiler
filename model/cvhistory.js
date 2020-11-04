const mongoose = require('./../lib/db-connect');
const autoIncrement = require('mongoose-auto-increment');
 
const cvHistorySchema = mongoose.Schema(
    {
        cv: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cvs', 
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', 
            required: true
        }, 
         version:{
            type: Number,
          },
          sections: [
           { 
            sectionId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sections', 
                required: true
            } ,
             description:{
               type: Object, 
             },
             name: {
                type: String
            },
             createdAt:{
                type: Date,
                default: Date.now()
            },
            updatedAt:{
                type: Date,
                default: Date.now()
            }}
          ]  
    },
    {
        timestamps: true
    } 
)
autoIncrement.initialize(mongoose);
cvHistorySchema.plugin(autoIncrement.plugin, { model: 'CvHistory', field: 'version', startAt: 1,incrementBy: 1});
const CvHistory = mongoose.model('cvhistory',cvHistorySchema);

module.exports = {CvHistory};
 