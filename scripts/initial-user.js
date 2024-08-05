const chalk = require("chalk");

const log = console.log;
const env = process.env;

const User = require("../models/user");
const { passwordEncryptor } = require("../utils/passwordEncryptor");

module.exports = {
  init: async () => {
    if (
      !env.DEFAULT_USER_FULLNAME ||
      !env.DEFAULT_USER_EMAIL ||
      !env.DEFAULT_USER_PASSWORD
    ) {
      return log("Data is missing");
      // chalk.red("Please provide required data to initiate (first-admin)")
    }

    const checkIfExist = await User.findOne({
      email: env.DEFAULT_USER_EMAIL
    });

    if (checkIfExist) {
      return log(chalk.magenta("Anonymous-user has already been initiated"));
    }

    const encryptedPassword = await passwordEncryptor(
      env.DEFAULT_USER_PASSWORD
    );

    let newUser = new User({
      fullname: env.DEFAULT_USER_FULLNAME,
      email: env.DEFAULT_USER_EMAIL,
      password: encryptedPassword
    });

    await newUser.save();

    // fetching admindata
    return log(chalk.green("Anonymous-user created first-time"));
  }
};
