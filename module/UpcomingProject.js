const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const upcomingProjectSchema = new Schema({
    // Hardcoded unique identifier system anchor to guarantee a single configuration node
    idAnchor: {
        type: String,
        default: "SINGLETON_UPCOMING_NODE",
        unique: true,
        immutable: true
    },
    upcomingTitle: {
        type: String,
        required: [true, "Staging target title is required."],
        default: "Distributed Log Aggregation Subsystem",
        trim: true
    },
    upcomingDesc: {
        type: String,
        required: [true, "Roadmap and architectural description details are required."],
        default: "Designing a highly available telemetry pipeline to collect, parse, and store cluster logs using Grafana Loki and vector agents with automated failovers.",
        trim: true
    },
    upcomingTags: {
        type: String, // Kept as a simple comma-separated string to match your React form state exactly
        required: [true, "Planned infrastructure technologies are required."],
        default: "Loki, Vector, Kubernetes, Go",
        trim: true
    },
    upcomingImg: {
        type: String,
        default: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        trim: true
    }
}, {
    timestamps: true
});

const UpcomingProject = mongoose.model('UpcomingProject', upcomingProjectSchema);
module.exports = UpcomingProject;