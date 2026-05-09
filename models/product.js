const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    category: String,

    name: String,

    description: String,

    price: String,

    stock: String,

    photoFile: String,

    videoFile: String

});

module.exports = mongoose.model("Product", productSchema);