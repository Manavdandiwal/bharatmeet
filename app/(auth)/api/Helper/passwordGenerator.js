const otpGenerator = require("generate-password");

const generator = () => {
    const password = otpGenerator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
    });
    return password;
};

export default generator;
