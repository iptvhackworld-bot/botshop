const Product = require("./models/Product");

async function seedProducts() {

    const count = await Product.countDocuments();

    if (count > 0) {
        return;
    }

    await Product.insertMany([

        {
            name: "Netflix Premium",
            description: "Compte Netflix UHD",
            price: 10,
            stock: 50,
            image: "https://i.imgur.com/2vQTZBb.jpeg"
        },

        {
            name: "Spotify Premium",
            description: "Compte Spotify Premium",
            price: 5,
            stock: 40,
            image: "https://i.imgur.com/tv5Jm0A.jpeg"
        },

        {
            name: "Disney+",
            description: "Compte Disney Plus",
            price: 7,
            stock: 30,
            image: "https://i.imgur.com/W6N7xQx.jpeg"
        }

    ]);

    console.log("✅ Produits ajoutés");

}

module.exports = {
    seedProducts
};