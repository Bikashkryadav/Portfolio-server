const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: {
        type: String,
        required: [true, "Language or tool name configuration string is required."],
        trim: true,
        unique: true 
    },
    level: {
        type: String,
        required: [true, "Competency operational level mapping required."],
        enum: {
            values: ["Expert", "Advanced", "Intermediate"],
            message: "{VALUE} is not a valid ecosystem skill tier parameter."
        },
        default: "Intermediate"
    }
}, {
    
    timestamps: true 
});

const Language = mongoose.model("Language", languageSchema);
module.exports = Language;