const mongoose = require('mongoose'); 
//const config = require('./../config/index') 
const connection = process.env.MONGODB_URL || "mongodb://mongo:27017/cvcompiler";
mongoose.connect( connection,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

module.exports = mongoose;

 



