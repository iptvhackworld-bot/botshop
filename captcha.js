function generateCaptcha() {

    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);

    return {
        question: `${a} + ${b}`,
        answer: a + b
    };
}

module.exports = {
    generateCaptcha
};