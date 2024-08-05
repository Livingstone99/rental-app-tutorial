const chalk = require("chalk");

const log = console.log;
const env = process.env;

const Admin = require("../models/admin");
const Permission = require("../models/permission");
const Role = require("../models/role");
const { passwordEncryptor } = require("../utils/passwordEncryptor");

module.exports = {
  init: async () => {
    let newRole = null;
    let newPermission = null;
    // check for initial data's
    if (
      !env.DEFAULT_ADMIN_FIRSTNAME ||
      !env.DEFAULT_ADMIN_LASTNAME ||
      !env.DEFAULT_ADMIN_NUMBER ||
      !env.DEFAULT_ADMIN_EMAIL ||
      !env.DEFAULT_ADMIN_PASSWORD ||
      !env.DEFAULT_ROLE_NAME ||
      !env.DEFAULT_ROLE_LIST ||
      !env.DEFAULT_PERMISSION_NAME
    ) {
      return log();
      // chalk.red("Please provide required data to initiate (first-admin)")
    }

    const checkIfExist = await Admin.findOne({
      email: env.DEFAULT_ADMIN_EMAIL
    });

    const checkIfExistRole = await Role.findOne({
      name: env.DEFAULT_ROLE_NAME
    });

    const checkIfExistPermission = await Permission.findOne({
      name: env.DEFAULT_PERMISSION_NAME
    });

    if (checkIfExist) {
      return log(chalk.magenta("First-admin has already been initiated"));
    }

    if (!checkIfExistRole) {
      newRole = new Role({
        name: env.DEFAULT_ROLE_NAME,
        list: [{ _id: "1", name: env.DEFAULT_ROLE_LIST }]
      });

      await newRole.save();
      log(chalk.green("Role created first-time"));
    }

    if (!checkIfExistPermission) {
      newPermission = new Permission({
        name: env.DEFAULT_PERMISSION_NAME,
        role: newRole === null ? checkIfExistRole._id : newRole._id
      });

      await newPermission.save();

      log(chalk.green("Permission created first-time"));
    }

    const passwordHash = passwordEncryptor(env.DEFAULT_ADMIN_PASSWORD);

    let newAdmin = new Admin({
      firstname: env.DEFAULT_ADMIN_FIRSTNAME,
      lastname: env.DEFAULT_ADMIN_LASTNAME,
      number: env.DEFAULT_ADMIN_NUMBER,
      email: env.DEFAULT_ADMIN_EMAIL,
      password: passwordHash,
      permission:
        newPermission === null ? checkIfExistPermission._id : newPermission._id
    });

    await newAdmin.save();

    // fetching admindata
    return log(chalk.green("Admin created first-time"));
  }
};
