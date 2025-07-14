const express = require("express");
const app = express();
const PORT = 3000;

// Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve frontend files from /public
app.use(express.static("public"));

// Example API route
app.get("/api/smriti", (req, res) => {
    res.json({
        name: "Smriti Neupane",
        role: "Backend Developer",
        message: "This is a test API created using Node.js and Express.js without DB."
    });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

