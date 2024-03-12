const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique:true
        },
        password:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        gender:{
            type: String,
        },
        id:{
            type: String,
            required: true,
            unique:true
        }
    },
    {
        collection: "web_user"
    }
);

const userProfileSchema = mongoose.Schema(
    {
        id:{
            type: String,
            required: true,
            unique:true
        },
        message:{
            type: String,
        },
        avatar_path:{
            type: String,
        },
    },
    {
        collection: "web_user_profile"
    }
);

module.exports = {
    User: mongoose.model('User', userSchema),
    UserProfile: mongoose.model('UserProfile', userProfileSchema)
  };