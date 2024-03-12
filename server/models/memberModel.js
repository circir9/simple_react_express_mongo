const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
    {
        id:{
            type: Number,
            required: true,
            unique:true
        },
        name:{
            type: String,
            required: true
        },
        identity:{
            type: String,
            required: true
        }
    },
    {
        collection: "school_member"
    }
);

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;