const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    telegramId: String,
    username: String,
    vip: {
        type: Boolean,
        default: false
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);