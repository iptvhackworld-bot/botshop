const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({

    quantity: String,

    price: Number

});

const productSchema = new mongoose.Schema({

    category: String,

    name: String,

    description: String,

    stock: Number,

    prices: [priceSchema],

    photoFile: String,

    videoFile: String

});

module.exports = mongoose.model(
    "Product",
    productSchema
);