const {mongoose} = require('./../connect');
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
    
        recommendation:[
            {
                name:{
                   type: String,  
                 },
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
 