const mongoose = require("mongoose");

const rouletteSchema = new mongoose.Schema({

    userId: String,

    lastSpin: Date

});

module.exports = mongoose.model(
    "Roulette",
    rouletteSchema
);