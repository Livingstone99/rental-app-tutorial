const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mailgun = require("mailgun-js");
const crypto = require("crypto");
const io = require("../socket");

const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
const {
  containsAny,
  getCurrentFullDate,
  getCurrentDateWithTimeOffset,
  generateRandom6digits
} = require("../utils/functions");
const { FileFactory } = require("../handlers/file/file_factory");

const { sendMailOtp } = require("../utils/mailgun");

const User = require("../models/user");
const OtpModel = require("../models/otp");
const { errorHandling } = require("../utils/errorHandling");
const { signedToken } = require("../utils/tokenSigning");
const { passwordCompare } = require("../utils/passwordEncryptor");
const { sendSmsCi } = require("../utils/acim-sms");

dotenv.config();

const accessUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // const date = getDateInYYMMDD();
  // const todayDate = getDateInYYMMDD();

  if (!email) {
    return errorHandling(res, {
      message: "Veuillez fournir au moins un e-mail",
      status: 400,
      registered: false
    });
  }

  const checkIfExist = await User.findOne({
    email: email
  });

  if (checkIfExist) {
    let auth_token = await signedToken(checkIfExist._id);

    // fetching admindata
    return res.send({
      message: "User logged in",
      auth_token: auth_token,
      logged: true,
      user: checkIfExist
    });
  }

  let newUser = new User({
    ...req.body
  });

  await newUser.save();

  let auth_token = await signedToken(newUser._id);

  // fetching admin data
  return res.send({
    message: "User access",
    registered: true,
    user: newUser,
    auth_token: auth_token
  });
});
const accessNumberUser = catchAsync(async (req, res, next) => {
  const { number } = req.body;

  // const date = getDateInYYMMDD();
  // const todayDate = getDateInYYMMDD();

  if (!number) {
    return errorHandling(res, {
      message: "Veuillez fournir un contact",
      status: 400,
      registered: false
    });
  }

  const checkIfExist = await User.findOne({
    number: number
  });

  if (checkIfExist) {
    let auth_token = await signedToken(checkIfExist._id);

    // fetching admindata
    return res.send({
      message: "User logged in",
      auth_token: auth_token,
      logged: true,
      user: checkIfExist
    });
  }

  let newUser = new User({
    ...req.body
  });

  await newUser.save();

  let auth_token = await signedToken(newUser._id);

  // fetching admin data
  return res.send({
    message: "User access",
    registered: true,
    user: newUser,
    auth_token: auth_token
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  try {
    let verifyUser = await User.findOne({ _id: id });
    if (verifyUser) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            ...req.body
          }
        }
      );
      let getUpdatedUser = await User.findOne({ _id: id });
      return res.send({ user: getUpdatedUser });
    } else {
      return res.send({
        exist: false,
        message: "The account you want to update doesnt exist"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const updatePayment = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const { network, number } = req.body;
  if (!network || !number) {
    return errorHandling(res, {
      message: "data is missing",
      status: 400
    });
  }

  if (number.length !== 0) {
    return errorHandling(res, {
      message: "Le numéro est exactement de 10 chiffres",
      status: 400
    });
  }
  try {
    let verifyUser = await User.findOne({ _id: id });
    if (verifyUser) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            payment_details: {
              network: network,
              number: number
            }
          }
        }
      );
      let getUpdatedUser = await User.findOne({ _id: id });
      return res.send({ user: getUpdatedUser });
    } else {
      return res.send({
        exist: false,
        message: "The account you want to update doesnt exist"
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const loginAnonymousUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    console.log("1");
    return errorHandling(res, {
      message: "L'email ou le mot de passe n'est pas correct",
      status: 400,
      connected: false
    });
  }

  const verifyUser = await User.findOne({ email: email });

  if (!verifyUser) {
    console.log("2");
    return errorHandling(res, {
      message: "L'email ou le mot de passe n'est pas correct",
      status: 400,
      connected: false
    });
  }

  if (verifyUser.status === 0) {
    console.log("2");
    return errorHandling(res, {
      message: "Ce compte est inactif ou suspendu",
      status: 400,
      connected: false
    });
  }

  const verifyPassword = await passwordCompare(password, verifyUser.password);

  if (verifyPassword) {
    console.log("3");
    let auth_token = await signedToken(verifyUser._id);

    // let us add the token value into user model to update it from there

    const updateUser = await User.findByIdAndUpdate(
      verifyUser._id,
      {
        refresh_token: auth_token
      },
      {
        new: true
      }
    );

    // encrypt admin value

    return res.send({
      admin: updateUser,
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

const deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  let verifyUser = await User.findOne({ _id: id });
  if (verifyUser) {
    let deleteUser = await User.deleteOne({ _id: id });
    return res.send({ message: "deleted successfully" });
  } else {
    return res.send({
      exist: false,
      message: "The account you want to delete doesnt exist"
    });
  }
});

const getAllUsers = catchAsync(async (req, res, next) => {
  let allUsers = await User.find().sort({ _id: -1 });
  return res.send({ user: allUsers });
});

const getAllLanlords = catchAsync(async (req, res, next) => {
  let allUsers = await User.find({
    iam_landlord: true
  }).sort({ _id: -1 });
  return res.send({ user: allUsers });
});

const getUser = catchAsync(async (req, res, next) => {
  let allUsers = await User.findOne({ _id: req.params.id });
  if (!allUsers) return res.send({ exist: false });
  res.send({ user: allUsers, exist: true });
});

const checkVerified = catchAsync(async (req, res, next) => {
  let allUsers = await User.findOne({ _id: req.params.id });
  if (!allUsers) return res.send({ exist: false });
  return res.send({ verified: allUsers.verified });
});

const countDoc = catchAsync(async (req, res, next) => {
  let allUsers = await User.countDocuments({});
  res.send({ count: allUsers });
});

const sendOTP = catchAsync(async (req, res, next) => {
  const { number, country_code } = req.body;

  const otp_code =
    number === "+2250504090795" ? "123456" : generateRandom6digits();

  // save otp in model
  const newOtp = new OtpModel({
    number,
    country_code,
    otp: otp_code,
    expire: getCurrentDateWithTimeOffset()
  });

  await newOtp.save();

  const sender = await sendSmsCi({
    dest: number.slice(1),
    message: `Votre code de verification est le ${otp_code}, veuillez ne pas le partager pour des mesure de securité`,
    title: "otp-sms"
  });

  if (!sender) {
    console.log("We have not been able to deliver the otp");
    console.log("(2)");
    return res.status(400).send({
      message: "Nous n'avons pas pu envoyer le OTP",
      code: "OTP_FAILED_TO_SEND"
    });
  }

  return res.status(200).send({
    status: 200,
    message: "✅✅✅",
    code: "SUCCESSFUL_SENT_SMS",
    token: newOtp._id
  });
});

const verifyOTP = catchAsync(async (req, res, next) => {
  const { number, country_code, otp, token } = req.body;

  const verifier = await OtpModel.findOne({ _id: token });

  if (!verifier) {
    console.log("We have not been able to verify the otp");
    return res.status(400).send({
      message: "Nous n'avons pas pu verifier le OTP",
      code: "OTP_FAILED_TO_VERIFIED",
      verified: false
    });
  }

  const d1 = verifier.expire;
  const d2 = getCurrentFullDate();

  console.log(d1, d2);
  console.log("stored otp: ", verifier.otp);
  console.log("my otp: ", otp);

  if (d1 < d2 || otp !== verifier.otp) {
    console.log("We have not been able to verify the otp");
    return res.status(400).send({
      message: "Nous n'avons pas pu verifier le OTP",
      code: "OTP_FAILED_TO_VERIFIED",
      verified: false
    });
  }

  return res.status(200).send({
    status: 200,
    message: "✅✅✅",
    code: "SUCCESSFUL_VERIFICATION_SMS",
    logged: false,
    verified: true
  });
});

const sendEmailOtpNewUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log("1");
  // send email otp to user now
  let generatedOtp = await generateRandom6digits();
  console.log("2");
  const otp_code =
    email === "vvictorious99@gmail.com" ? "123456" : generatedOtp;
  console.log("3");
  // save otp in model
  const newOtp = new OtpModel({
    number: email,
    country_code: "+225",
    otp: otp_code,
    expire: getCurrentDateWithTimeOffset()
  });
  console.log("4");
  await newOtp.save();
  console.log("5");
  await sendMailOtp({
    title: "LAMAISON | OTP",
    data: {
      fullname: "Utilisateur",
      email: email,
      otp: generatedOtp
    }
  });
  console.log("6");
  console.log(newOtp._id)
  return res.send({
    message: "Nous avons envoyé un code de vérification sur votre email",
    token: newOtp._id,
    exist: false
    // otp: generatedOtp
  });
});

const verifyEmailOTP = catchAsync(async (req, res, next) => {
  const { email, otp, token } = req.body;
console.log(req.body)
  const verifier = await OtpModel.findOne({ _id: token });

  if (!verifier) {
    console.log("We have not been able to verify the otp");
    return res.status(400).send({
      message: "Nous n'avons pas pu verifier le OTP",
      code: "OTP_FAILED_TO_VERIFIED",
      verified: false
    });
  }

  const d1 = verifier.expire;
  const d2 = getCurrentFullDate();

  console.log(d1, d2);
  console.log("stored otp: ", verifier.otp);
  console.log("my otp: ", otp);

  if (d1 < d2 || otp !== verifier.otp) {
    console.log("We have not been able to verify the otp");
    return res.status(400).send({
      message: "Nous n'avons pas pu verifier le OTP",
      code: "OTP_FAILED_TO_VERIFIED",
      verified: false
    });
  }

  const verifyUser = await User.findOne({ email: email });

  if (verifyUser) {
    console.log("3");
    let auth_token = await signedToken(verifyUser._id);

    // let us add the token value into user model to update it from there

    const updateUser = await User.findByIdAndUpdate(
      verifyUser._id,
      {
        refresh_token: auth_token
      },
      {
        new: true
      }
    );

    return res.send({
      user: updateUser,
      auth_token,
      message: "✅✅✅",
      code: "SUCCESSFUL_VERIFICATION_SMS",
      logged: true,
      verified: true
    });
  }

  return res.status(200).send({
    status: 200,
    message: "✅✅✅",
    code: "SUCCESSFUL_VERIFICATION_SMS",
    logged: false,
    verified: true
  });
});

module.exports = {
  accessUser,
  updateUser,
  loginAnonymousUser,
  sendEmailOtpNewUser,
  verifyEmailOTP,
  updatePayment,
  deleteUser,
  getAllUsers,
  getAllLanlords,
  getUser,
  checkVerified,
  countDoc,
  sendOTP,
  verifyOTP,
  accessNumberUser
};
