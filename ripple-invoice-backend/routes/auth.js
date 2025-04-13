const express = require("express");
const User = require("../models/User");
const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Request received:", req.body);

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (user.password !== password) {
            console.log("Password mismatch:", password, "!=", user.password);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({
            username: user.username,
            email: user.email,
            walletAddress: user.walletAddress,
            name: user.name
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;