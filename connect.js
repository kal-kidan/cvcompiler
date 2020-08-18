const mongoose = require('mongoose'); 
mongoose.connect("mongodb://localhost:27017/cvcompiler",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

module.exports = {mongoose};

 



