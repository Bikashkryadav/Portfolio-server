const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ;

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173","https://portfolio-p2hd.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mainRouter = require("./router/main");

app.use("/api", mainRouter);

app.get("/", (req, res) => {
    res.status(200).json({ 
        status: "ONLINE", 
        message: "DevOps Portfolio Core Orchestrator Node Engine active." 
    });
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("⚡ [SUCCESS] Handshake with MongoDB infrastructure established smoothly.");
        
        app.listen(PORT, () => {
            console.log(`🚀 [LAUNCH] Core server cluster operating on interface: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("🛑 [CRITICAL FAILURE] Cluster link to MongoDB state dropped:", err.message);
        process.exit(1); 
    });