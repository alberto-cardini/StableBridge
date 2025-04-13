const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    name: { type: String }
});

module.exports = mongoose.model("User", userSchema);