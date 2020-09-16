const {mongoose} = require('./../connect');
const {user} = require('./user');
const {cv} = require('./cv');

const adminCvSchema = mongoose.Schema(
    {
         
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
             ref: 'users', 
            required: true
        },
        cvId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'cvs', 
          required: true
        }
        
    },
    
    {
        timestamps: true
    }
)
const adminCv = mongoose.model('adminCv',adminCvSchema);

module.exports = {adminCv};
 