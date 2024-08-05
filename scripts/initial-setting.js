const chalk = require("chalk");

const log = console.log;
const env = process.env;

const Config = require("../models/config");

module.exports = {
  init: async () => {
    // check for initial data's

    const checkIfExist = await Config.find({});

    if (checkIfExist.length > 0) {
      return log(chalk.magenta("First-config has already been initiated"));
    }

    let newConfig = new Config({});

    await newConfig.save();

    // fetching admindata
    return log(chalk.green("Config created first-time"));
  }
};
