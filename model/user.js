const {mongoose} = require('../connect');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {cv} = require('./cv');
const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true, 
            validate(value){
                if(!validator.isAlpha(value)){
                    throw new Error("please enter valid name");
                }
            }
        },
        lastName: {
            type: String,
            required: true,
            trim: true, 
            validate(value){
                if(!validator.isAlpha(value)){
                    throw new Error("please enter valid name");
                }
            }
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("the email is not valid");
                }
            }
        },
        phoneNumber: {
            type: String,
            required: true, 
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role:{
            type: String,
            required: true 
        },
        assignedCv:{
            type: Number
        },
        tokens: [
            {
                token: {
                    type: String, 
                    required: true
                }
            }
        ],
       
    } 
);
userSchema.virtual('cvs', {
    ref: 'cv',
    localField: '_id',
    foreignField: 'userId'
})
userSchema.methods.getAuthToken = async function (){
    const usere= this 
    const token = jwt.sign({_id: usere._id.toString()}, "mynode"); 
    usere.tokens = usere.tokens.concat({token});
    await usere.save() 
    return token;
 }

 userSchema.methods.toJSON = function(){
    const user = this
    userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject 
  }

  userSchema.statics.findByCredentials = async (email, password)=>{ 
    const usere = await user.findOne({email})
    if(!usere){
        return ("incorrect username or password")
    }

    const isValidPassword = await bcrypt.compare(password, usere.password);

    if(!isValidPassword){
        return ("incorrect username or password")
    }

    return usere;
}

userSchema.pre('save', async function(next){ 
    const usere = this
    if(usere.isModified('password')){ 
        usere.password = await bcrypt.hash(usere.password, 8)
    }
    next()
})

 

const user = mongoose.model('user',userSchema);

module.exports = {user};
