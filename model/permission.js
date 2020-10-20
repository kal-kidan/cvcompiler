const mongoose = require('./../lib/db-connect');
const permissionSchema = mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    permissions:[String]
})

const Permission = permissionSchema.model('Permission', permissionSchema);
module.exports = {Permission}