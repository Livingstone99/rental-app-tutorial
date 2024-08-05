const jwt = require("jsonwebtoken");

const signedToken = (id) => {
  return (
    "Bearer " +
    jwt.sign({ id }, process.env.SECRET_KEY, {
      algorithm: "HS256"
      // expiresIn: process.env.JWT_EXPIRES_IN,
    })
  );
};

module.exports = { signedToken };
