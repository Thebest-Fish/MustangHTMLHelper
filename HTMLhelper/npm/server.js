require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");

const app = express();

// 🔹 Connect to MongoDB (Only Once)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.json());

// 🔹 Enable CORS for Frontend
app.use(cors({ origin: "http://localhost:5500", credentials: true }));

// 🔹 Setup Session Middleware (Use MongoDB Store for Sessions)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 1 Day
}));

// 🔹 User Schema & Model
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
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
        req.session.user = user._id;
        res.json({ success: true, message: "✅ Login successful" });
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
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

// 🔹 Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
