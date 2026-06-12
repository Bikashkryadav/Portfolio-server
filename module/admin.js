const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    ownerName: { 
        type: String, 
        default:"Bikash Kumar Yadav",
        required: [true, "Owner name is required."],
    },
    adminPassword: { 
        type: String, 
        required: [true, "Admin password verification hash is required."]
    },
    ownerBio: { 
        type: String, 
        required: [true, "Owner bio content string is required."],
        default:"Hi, I'm a DevOps & Infrastructure Engineer. I bridge the gap between development efficiency and system dependability by writing clean Infrastructure as Code."
    },
    ownerAvatar: { 
        type: String, 
        required: [true, "Avatar image path target is required."],
        default:"https://scontent.fktm14-1.fna.fbcdn.net/v/t39.30808-6/721430692_1339335854840195_6807219005822494227_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx250x224&ctp=s250x224&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=fXYNjrUPpu8Q7kNvwFllQ-E&_nc_oc=AdoNdSpwJW5AUE-5KgHuwf7yOLqcQqCKsxQSYz9Mbcv7FPhgjvoHzlnGkwmE47QH4ZM&_nc_zt=23&_nc_ht=scontent.fktm14-1.fna&_nc_gid=mSHMqxlFihZ0UH7KIYwt_Q&_nc_ss=7b2a8&oh=00_Af_h3hPFNCMNMyOpGmVbAqTWuaFqzkYNI7ohkJAfsf2amA&oe=6A302605"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;