const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    telegramId: String,

    role: {

        type: String,

        default: "moderator"

    }

});

module.exports = mongoose.model(
    "Admin",
    adminSchema
);