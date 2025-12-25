const bcrypt = require("bcryptjs");


//Encrypting Password
const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

// Comparing Hashed and Encryped Password
const comparePassword = async(password,hashedPassword)=>{
    return bcrypt.compare(password, hashedPassword);
}

module.exports = {hashPassword,comparePassword}