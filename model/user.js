const mongoose = require('./../lib/db-connect');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
var mongoosePaginate = require('mongoose-paginate')

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
        verified:{
            type: Boolean,
            default: false
        }, 
        role:{
            type: String,
            required: true 
        },
        assignedCv:{
            type: Number
        } 
    } 
)

userSchema.plugin(mongoosePaginate);
 
userSchema.methods.getAuthToken = async function (){
    let User= this 
    const token = jwt.sign({
        email: User.email,
        _id: User._id
    }, "mynode"); 
    return token;
 }

 userSchema.methods.toJSON = function(){
    const user = this
    userObject = user.toObject()
    delete userObject.password
    return userObject 
  }

  userSchema.statics.findByCredentials = async (email, password)=>{   
    let User;
    try {
        User = await user.findOne({email})
        if(!User){
            return ("incorrect username or password")
        }

        const isValidPassword = await bcrypt.compare(password, User.password);

        if(!isValidPassword){
            return ("incorrect username or password")
        }
 
    } catch (error) {
        console.log("error finding by credentials \n", error)
    }
    return User;
}

userSchema.pre('save', async function(next){ 
    const user = this
    if(user.isModified('password')){ 
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

 

const user = mongoose.model('users',userSchema);

module.exports = {user};