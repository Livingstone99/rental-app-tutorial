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

const Admin = require("../models/admin");
const {
  passwordEncryptor,
  passwordCompare
} = require("../utils/passwordEncryptor");

dotenv.config();

const createAdmin = catchAsync(async (req, res, next) => {
  const { email, password, number } = req.body;

  if (!email || !password || !number)
    return errorHandling(res, {
      message: "Please provide email, password or number",
      status: 400,
      created: false
    });

  const checkIfExist = await Admin.findOne({
    email: email
  });

  if (checkIfExist) {
    return errorHandling(res, {
      message: "L'email est déjà utilisé",
      status: 400,
      created: false
    });
  }

  const passwordHash = passwordEncryptor(req.body.password);

  let newAdmin = new Admin({
    ...req.body,
    password: passwordHash
  });

  await newAdmin.save();

  // fetching admindata
  return errorHandling(res, {
    message: "Admin successfully created",
    status: 200,
    created: true
  });
});

const loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("1");
    return errorHandling(res, {
      message: "L'email ou le mot de passe n'est pas correct",
      status: 400,
      connected: false
    });
  }

  const verifyAdmin = await Admin.findOne({ email: email });

  if (!verifyAdmin) {
    console.log("2");
    return errorHandling(res, {
      message: "L'email ou le mot de passe n'est pas correct",
      status: 400,
      connected: false
    });
  }

  if (verifyAdmin.status === 0) {
    console.log("2");
    return errorHandling(res, {
      message: "Ce compte est inactif ou suspendu",
      status: 400,
      connected: false
    });
  }

  const verifyPassword = passwordCompare(
    req.body.password,
    verifyAdmin.password
  );

  if (verifyPassword) {
    console.log("3");
    let auth_token = await signedToken(verifyAdmin._id);

    // let us add the token value into admin model to update it from there

    const updateAdmin = await Admin.findByIdAndUpdate(
      verifyAdmin._id,
      {
        refresh_token: auth_token
      },
      {
        new: true
      }
    ).populate({
      path: "permission",
      populate: {
        path: "role",
        model: "role"
      }
    });

    // encrypt admin value

    return res.send({
      admin: updateAdmin,
      connected: true,
      auth_token,
      message: "Verification completed"
    });
  }
  console.log("4");
  return errorHandling(res, {
    message: "L'email ou le mot de passe est incorrect",
    status: 400,
    connected: false
  });
});

const updateAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyAdmin = await Admin.findOne({ _id: id });
  if (verifyAdmin) {
    // console.log(req.body);
    let updatedAdmin = await Admin.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      },
      { new: true }
    );

    return errorHandling(res, {
      message: "Admin updated successfully",
      status: 200,
      updated: true
    });
  }
  return errorHandling(res, {
    message: "Item not found",
    status: 400,
    updated: false
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { password } = req.body;
  let verifyAdmin = await Admin.findOne({ _id: id });
  if (verifyAdmin) {
    const passwordHash = passwordEncryptor(password);
    await Admin.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          password: passwordHash
        }
      }
    );
    return errorHandling(res, {
      message: "Admin updated successfully",
      status: 200,
      updated: true
    });
  }
  return errorHandling(res, {
    message: "item not found",
    status: 404,
    updated: false
  });
});

const deleteAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // check if super-admin

  let findAdmin = await Admin.findOne({ _id: id });

  if (findAdmin && findAdmin.email === process.env.DEFAULT_ADMIN_EMAIL) {
    return errorHandling(res, {
      message: "Restricted to delete super-admin account",
      status: 400,
      deleted: false
    });
  }

  let deleteAdmin = await Admin.findByIdAndDelete({ _id: id });
  if (!deleteAdmin)
    return errorHandling(res, {
      message: "item not found",
      status: 404,
      deleted: false
    });

  return errorHandling(res, {
    message: "Admin deleted successfully",
    status: 200,
    deleted: true
  });
});

const checkAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let getAdmin = await Admin.findOne({ _id: id });
  if (!getAdmin)
    return errorHandling(res, {
      message: "item not found",
      status: 404,
      exist: false
    });
  return errorHandling(res, {
    message: "Data found",
    status: 200,
    exist: true
  });
});

const getAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let getAdmin = await Admin.findOne(
    { _id: id },
    {
      _id: 1,
      email: 1,
      number: 1,
      firstname: 1,
      lastname: 1,
      permission: 1,
      status: 1
    }
  ).populate("permission");
  if (!getAdmin)
    return errorHandling(res, {
      message: "item not found",
      status: 404,
      exist: false
    });

  return errorHandling(res, {
    message: "Admin existe",
    status: 200,
    exist: true,
    admin: getAdmin
  });
});

const getAllAdmin = catchAsync(async (req, res, next) => {
  let allAdmin = await Admin.find(
    {},
    {
      _id: 1,
      email: 1,
      number: 1,
      firstname: 1,
      lastname: 1,
      permission: 1,
      status: 1
    }
  )
    .sort({ _id: -1 })
    .populate("permission");

  return errorHandling(res, {
    message: "Admin obtenu avec succès",
    status: 200,
    admin: allAdmin
  });
});

const countAll = catchAsync(async (req, res, next) => {
  let allAdmins = await Admin.countDocuments({});
  return errorHandling(res, {
    message: "Count admin obtenu avec succès",
    status: 200,
    admin: allAdmins
  });
});

module.exports = {
  createAdmin,
  loginAdmin,
  updateAdmin,
  updatePassword,
  deleteAdmin,
  checkAdmin,
  getAdmin,
  getAllAdmin,
  countAll
};
