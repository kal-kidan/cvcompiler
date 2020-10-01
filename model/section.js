const mongoose = require('./../lib/db-connect'); 
const sectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        category: { 
            type: String,
            required: true
        }
    },
    
    {
        timestamps: true
    }
)
const section = mongoose.model('sections',sectionSchema);

module.exports = {section};
 