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
        }
    },
    
    {
        timestamps: true
    }
)
const cv = mongoose.model('cv',cvSchema);

module.exports = {cv};
 