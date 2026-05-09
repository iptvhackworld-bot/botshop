const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
    userId: String,
    code: String,
    reduction: Number,
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);