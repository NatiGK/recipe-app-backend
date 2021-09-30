const mongoose = require('mongoose');
const validator = require('validator');

var crypto = require('crypto');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'The name field is required']
    },
    avatar: {
        type:String,
        default: "www.defaultAvatar.com"  
    },
    email: {
        type:String,
        validate:{
            validator: validator.isEmail,
            message: 'The email you provided is not valid.'
        },
    },
    hash: String,
    salt:String,
});


const User = mongoose.model('User', userSchema);

module.exports = User;