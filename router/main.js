const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config()
// Import Models
const Admin = require("../module/admin");
const Project = require("../module/Project");
const UpcomingProject = require("../module/UpcomingProject");
const Language = require("../module/languages");

// A secure JWT Secret (In production, load this from process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ error: "Unauthorized." });

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 🌟 ATTACH ID HERE: This appends the data to the current request lifecycle
        req.adminId = decoded.id;

        next(); // Pass control to the actual route handler
    } catch (err) {
        return res.status(401).json({ error: "Invalid token." });
    }
};

router.post("/admin/authpass", async (req, res) => {
    try {
        const { adminPassword } = req.body;
        if (!adminPassword) {
            return res.status(400).json({ error: "Missing adminPassword parameter payload." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);
        const newAdmin = await Admin.create({
            ownerName: "BKY_root@devops",
            adminPassword: hashedAdminPassword,
            ownerBio: "Hi, I'm a DevOps & Infrastructure Engineer.",
            ownerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        });
        res.status(201).json({
            success: true,
            message: "Root admin configurations provisioned successfully."
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/admin/authchangepass", protect, async (req, res) => {
    try {

        const currentAdminId = req.adminId;// Clear out input field state
        const { adminPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(adminPassword, salt);
        const updatedAdmin = await Admin.findByIdAndUpdate(
            currentAdminId,
            { adminPassword: hashedNewPassword },
            { new: true }
        );
        if (!updatedAdmin) {
            return res.status(444).json({
                success: false,
                error: "System error: Root orchestrator document profile missing."
            });
        }
        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/admin/auth", async (req, res) => {
    try {
        const { adminPassword } = req.body;

        // Find system admin profile configuration
        const adminProfile = await Admin.findOne();
        if (!adminProfile) {
            return res.status(404).json({ error: "Root configuration profile has not been initialized." });
        }
        const isMatch = await bcrypt.compare(adminPassword, adminProfile.adminPassword);


        if (!isMatch) {
            return res.status(401).json({ authenticated: false, error: "ACCESS DENIED: Credentials invalid." });
        }

        // Issue signed JSON Web Token valid for 24 hours
        const token = jwt.sign({ id: adminProfile._id }, JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({
            authenticated: "authenticated",
            message: "Handshake Complete.",
            token: token // This token must be stored by React (e.g., localStorage) and appended to Headers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch Profile Configuration (Public)
router.get("/admin/profile", async (req, res) => {
    try {
        const adminProfile = await Admin.findOne().select("-adminPassword");
        const language = await Language.find();
        const Projects = await Project.find();
        const UpcomingProjects = await UpcomingProject.findOne()
        res.status(200).json({ adminProfile, language, Projects, UpcomingProjects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile Configurations (🔒 Protected)
router.put("/admin/profile/update", protect, async (req, res) => {
    try {
        const { ownerName, ownerBio, ownerAvatar } = req.body;
        const id = req.adminId
        const updatedProfile = await Admin.findByIdAndUpdate(
            id,
            { ownerName, ownerBio, ownerAvatar },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedProfile });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Push New Project Deployment Module (🔒 Protected)
router.post("/projects", protect, async (req, res) => {
    try {
        const { title, desc, metric, tags, image, link } = req.body;

        const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

        const newProject = await Project.create({
            title,
            desc,
            metric,
            tags: tagsArray,
            image,
            link
        });

        res.status(201).json({ success: "Sucessfully Upload Project", data: newProject });

    } catch (err) {
        console.error("🛑 Project creation failed:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// Inline Mutation Update Project Node (🔒 Protected)
router.put("/projects/:id", protect, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedProject });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Purge Project Configuration Module (🔒 Protected)
router.delete("/projects/:id", protect, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: "Sucessfully Delete project", });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* ==========================================
   3. RUNTIME LANGUAGE / ECOSYSTEM ENDPOINTS
   ========================================== */


// Inject Runtime Skill Module (🔒 Protected)
router.post("/languages", protect, async (req, res) => {
    try {
        const { name, level } = req.body;

        const newLanguage = new Language({ 
            name, 
            level 
        });

        await newLanguage.save();

        res.status(201).json({ success: "Sucessfully Upload New language", data: newLanguage });

    } catch (err) {
        console.error("🛑 Skill injection rejected:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// Modify Language Inline Configuration (🔒 Protected)
router.put("/languages/:id", protect, async (req, res) => {
    try {
        console.log(req.params.id)
        const updatedLanguage = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedLanguage });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}); 

// Purge Language Node (🔒 Protected)
router.delete("/languages/:id", protect, async (req, res) => {
    try {
        await Language.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Technical language configuration purged." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Upcoming Target Blueprint (🔒 Protected)
router.put("/upcoming", protect, async (req, res) => {
    try {
        const { upcomingTitle, upcomingDesc, upcomingTags, upcomingImg } = req.body;
        const updatedBlueprint = await UpcomingProject.findOneAndUpdate(
            { idAnchor: "SINGLETON_UPCOMING_NODE" },
            { upcomingTitle, upcomingDesc, upcomingTags, upcomingImg },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: updatedBlueprint });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;