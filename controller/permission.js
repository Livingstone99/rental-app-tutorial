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

const Permission = require("../models/permission");

dotenv.config();

const createPermission = catchAsync(async (req, res, next) => {
  const { name, role } = req.body;

  if (!name || !role)
    return errorHandling(res, {
      message: "Nom & role sont obligatoires",
      status: 400,
      created: false
    });

  let newPermission = new Permission({
    ...req.body
  });

  await newPermission.save();

  // fetching permissiondata
  return errorHandling(res, {
    message: "Le permission a été créé avec succès",
    status: 200,
    created: true
  });
});

const updatePermission = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyPermission = await Permission.findOne({ _id: id });
  if (verifyPermission) {
    await Permission.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return errorHandling(res, {
      message: "La permission a été modifié avec succès",
      status: 200,
      created: false
    });
  }
  return errorHandling(res, {
    message: "Permission not found",
    status: 404,
    updated: false
  });
});

const deletePermission = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let findPermission = await Permission.findOne({ _id: id });

  if (
    findPermission &&
    findPermission.name === process.env.DEFAULT_PERMISSION_NAME
  ) {
    return errorHandling(res, {
      message: "Restricted to delete super-admin permission",
      status: 400,
      deleted: false
    });
  }

  let deletePermission = await Permission.findByIdAndDelete({ _id: id });
  if (!deletePermission)
    return errorHandling(res, {
      message: "Permission not found",
      status: 404,
      deleted: false
    });
  return errorHandling(res, {
    message: "Permission deleted",
    status: 200,
    deleted: true
  });
});

const getPermission = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let getPermission = await Permission.findOne({ _id: id }).populate("role");
  if (!getPermission)
    return errorHandling(res, {
      message: "Permission not found",
      status: 404,
      deleted: false
    });
  return errorHandling(res, {
    message: "Permission found",
    status: 200,
    permission: getPermission
  });
});

const getAllPermission = catchAsync(async (req, res, next) => {
  let allPermission = await Permission.find()
    .sort({ _id: -1 })
    .populate("role");
  return errorHandling(res, {
    message: "Permission found",
    status: 200,
    permission: allPermission
  });
});

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getPermission,
  getAllPermission
};
