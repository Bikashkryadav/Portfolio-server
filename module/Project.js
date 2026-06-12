const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: [true, "Project deployment module title is required."],
        trim: true
    },
    desc: {
        type: String,
        required: [true, "Architecture design description string is required."],
        trim: true
    },
    metric: {
        type: String,
        required: [true, "Performance optimization or structural result metric is required."],
        placeholder: "e.g., ⚡ Result: Reduced cluster deployment time by 82%"
    },
    tags: {
        type: [String], // Array of strings matching your frontend .map() loop requirements
        required: [true, "Provide at least one core tool or technology tag node."],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "Project parameter configurations must include an array of technology strings."
        }
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80"
    },
    link: {
        type: String,
        default: "https://github.com",
        trim: true
    }
}, {
    // Generates tracking parameters (createdAt, updatedAt) automatically
    timestamps: true 
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;