const mongoose = require("mongoose");

const projectFileSchema = mongoose.Schema(
    {
        name: { 
            type: String,
            required: true 
        },
        id: { 
            type: String,
            required: true,
            unique:true
        },
        url: { 
            type: String,
            required: true 
        },
        uid: { 
            type: String,
            required: true
        },
        upload_time: { 
            type: Date,
            required: true
        }
    },
    {
        collection: "project_file"
    }
);

const ProjectFile = mongoose.model("Project_File", projectFileSchema);

module.exports = ProjectFile;