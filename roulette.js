const PromoCode = require("./models/PromoCode");

const rewards = [5, 10, 15, 20, 25, 30, 50];

function generateCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

async function playRoulette(userId) {

    const reduction = rewards[
        Math.floor(Math.random() * rewards.length)
    ];

    const code = generateCode();

    const promo = new PromoCode({
        userId,
        code,
        reduction
    });

    await promo.save();

    return {
        reduction,
        code
    };
}

module.exports = {
    playRoulette
};