const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    clientId: String,

    username: String,

    productId: String,

    productName: String,

    quantity: Number,

    total: Number,

    status: {
        type: String,
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Order",
    orderSchema
);