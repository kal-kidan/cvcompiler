const {mongoose} = require('./../connect');
const {user} = require('./user');
const {cv} = require('./cv');

const adminCvSchema = mongoose.Schema(
    {
         
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            unique: true,
            required: true
        },
        cvIds: 
           [  
            {
              cvId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'cv',
                unique: true,
                required: true
              }
            }]
        
    },
    
    {
        timestamps: true
    }
)
const adminCv = mongoose.model('adminCv',adminCvSchema);

module.exports = {adminCv};
 