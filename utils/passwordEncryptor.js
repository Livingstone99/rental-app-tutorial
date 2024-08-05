const bcrypt = require("bcryptjs");

const passwordEncryptor = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(process.env.SECRET_KEY + password, salt);
  return hash;
};

const passwordCompare = (password, hash) => {
  return bcrypt.compareSync(process.env.SECRET_KEY + password, hash);
};

module.exports = { passwordEncryptor, passwordCompare };
