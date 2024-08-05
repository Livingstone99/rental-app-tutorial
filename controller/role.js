const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
const { google } = require("googleapis");
const crypto = require("crypto");
const { catchAsync } = require("../utils/catchAsync");
const { errorHandling } = require("../utils/errorHandling");
const { signedToken } = require("../utils/tokenSigning");

const Role = require("../models/role");

dotenv.config();

const createRole = catchAsync(async (req, res, next) => {
  const { name, list } = req.body;

  if (!name || !list || list.length === 0)
    return errorHandling(res, {
      message: "Nom & list sont obligatoires",
      status: 400
    });

  let newRole = new Role({
    ...req.body
  });

  await newRole.save();
  // fetching permissiondata
  return errorHandling(res, {
    message: "Role created successfully",
    status: 200
  });
});

const updateRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyRole = await Role.findOne({ _id: id });
  if (verifyRole) {
    await Role.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return errorHandling(res, {
      message: "Role updated",
      status: 200
    });
  }
  return errorHandling(res, {
    message: "Role not updated",
    status: 404
  });
});

const deleteRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let findRole = await Role.findOne({ _id: id });

  if (findRole && findRole.name === process.env.DEFAULT_ROLE_NAME) {
    return errorHandling(res, {
      message: "Restricted to delete super-admin role",
      status: 400,
      deleted: false
    });
  }
  let deleteRole = await Role.findByIdAndDelete({ _id: id });
  if (!deleteRole)
    return errorHandling(res, {
      message: "Role not found",
      status: 404
    });
  return errorHandling(res, {
    message: "Role deleted successfully",
    status: 200
  });
});

const getRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let getRole = await Role.findOne({ _id: id });
  if (getRole)
    return errorHandling(res, {
      message: "Role found",
      status: 200,
      role: getRole
    });

  return res.status(404).send({ message: "role not found" });
});

const getAllRole = catchAsync(async (req, res, next) => {
  let allRole = await Role.find().sort({ _id: -1 });
  return errorHandling(res, {
    message: "Role found",
    status: 200,
    role: allRole
  });
});

module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getRole,
  getAllRole
};
