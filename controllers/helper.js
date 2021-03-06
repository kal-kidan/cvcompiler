 const path = require('path')
 
 validateExtension = (req, file, callback) =>{ 
    if (path.extname(file.originalname) !== '.pdf') {
      req.fileValidationError = 'Only pdfs are allowed';
      return callback(new Error('Only pdfs are allowed'), false); 
    }

    callback(null, true)
  }
  renameFile = (req, file, callback) => {
    let fileName =  file.fieldname + '-' +Date.now() + Math.round(Math.random() * 1E9)+  ".pdf"
    req.fileName = fileName
    callback(null, fileName) 
   
}
  module.exports={
      validateExtension,
      renameFile
  }