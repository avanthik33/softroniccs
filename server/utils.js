const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const validatePassword = async(password) => {
  const pass = password.trim();
  if (pass.length < 8) {
    return await "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(pass)) {
    return await "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(pass)) {
    return await "Password must contain at least one lowercase letter.";
  }
  if (!/\d/.test(pass)) {
    return await "Password must contain at least one digit.";
  }
  return await true;
};

module.exports = { hashPassword, validatePassword };
