const PromoCode = require("./models/PromoCode");

async function verifyPromo(code) {

    const promo = await PromoCode.findOne({ code });

    if (!promo) {
        return {
            valid: false,
            message: "❌ Code invalide"
        };
    }

    if (promo.used) {
        return {
            valid: false,
            message: "⚠️ Code déjà utilisé"
        };
    }

    promo.used = true;

    await promo.save();

    return {
        valid: true,
        reduction: promo.reduction,
        message: `✅ Réduction validée : ${promo.reduction}%`
    };
}

module.exports = {
    verifyPromo
};