require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const path = require("path"); // Ensure path is declared only once

const app = express();

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(cors({ origin: "http://localhost:5500", credentials: true }));

// 🔹 Setup Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 1 Day
}));

// 🔹 Serve Static Files
app.use(express.static(path.join(__dirname, ".."))); // Serves HTML, CSS, JS files

// 🔹 User Schema & Model
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    progress: { type: Object, default: {} }  // Stores user progress
});
const User = mongoose.model("User", userSchema);

// 🔹 Register User
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({ email, password: hashedPassword });
        res.json({ success: true, message: "✅ User registered!" });
    } catch (error) {
        res.json({ success: false, message: "❌ Email already in use" });
    }
});

// 🔹 Login User
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = { id: user._id, email: user.email };
        res.json({ success: true, message: `✅ Welcome, ${user.email}!` });
    } else {
        res.json({ success: false, message: "❌ Invalid email or password" });
    }
});

// 🔹 Logout User
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.json({ success: true, message: "✅ Logged out" }));
});

// 🔹 Check Login Status
app.get("/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, email: req.session.user.email });
    } else {
        res.json({ authenticated: false });
    }
});

// 🔹 Save User Progress
app.post("/save-progress", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { progress } = req.body;

    try {
        await User.findByIdAndUpdate(req.session.user.id, { progress });
        res.json({ success: true, message: "✅ Progress saved!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Error saving progress" });
    }
});

// 🔹 Get User Progress
app.get("/get-progress", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.session.user.id);
    if (user) {
        res.json({ success: true, progress: user.progress });
    } else {
        res.status(404).json({ success: false, message: "❌ User not found" });
    }
});

// 🔹 Handle 404 Errors (Page Not Found)
app.use((req, res) => {
    res.status(404).send("❌ Page not found");
});

// 🔹 Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/login.html`));
