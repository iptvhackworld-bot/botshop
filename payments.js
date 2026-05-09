function getPaymentMessage() {

    return `💳 Méthodes de paiement disponibles :

• PayPal
• Bitcoin
• Crypto

📧 PayPal : ${process.env.PAYPAL_EMAIL}

₿ BTC :
${process.env.BTC_ADDRESS}`;
}

module.exports = {
    getPaymentMessage
};