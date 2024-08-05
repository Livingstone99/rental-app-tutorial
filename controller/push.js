const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const crypto = require("crypto");
const { Expo } = require("expo-server-sdk");
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/appError");
var adminFirebase = require("firebase-admin");

const Push = require("../models/push");

dotenv.config();

var serviceAccount = require("../serviceAccountKey.json");

adminFirebase.initializeApp({
  credential: adminFirebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

//sending push with expo push notification service (react native)

// const sendPush = catchAsync(async (req, res, next) => {
//   const { title, body } = req.body;
//   let expo = new Expo();
//   let messages = [];
//   for (let pushToken of req.body.tokens) {
//     if (!Expo.isExpoPushToken(pushToken)) {
//       console.error(`Push token ${pushToken} is not a valid Expo push token`);
//       continue;
//     }
//     messages.push({
//       to: pushToken,
//       sound: "default",
//       title: title,
//       body: body,
//       data: { withSome: "data" }
//     });
//   }

//   let chunks = expo.chunkPushNotifications(messages);
//   let tickets = [];
//   (async () => {
//     for (let chunk of chunks) {
//       try {
//         let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//         console.log(ticketChunk);
//         tickets.push(...ticketChunk);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   })();

//   let receiptIds = [];
//   for (let ticket of tickets) {
//     if (ticket.id) {
//       receiptIds.push(ticket.id);
//     }
//   }

//   let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
//   (async () => {
//     for (let chunk of receiptIdChunks) {
//       try {
//         let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//         console.log(receipts);
//         for (let receiptId in receipts) {
//           let { status, message, details } = receipts[receiptId];
//           if (status === "ok") {
//             continue;
//           } else if (status === "error") {
//             console.error(
//               `There was an error sending a notification: ${message}`
//             );
//             if (details && details.error) {
//               console.error(`The error code is ${details.error}`);
//             }
//           }
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   })();
//   res.send({ message: "sent" });
// });

//sending push with google cloud messaging (firebase)

const sendPush = catchAsync(async (req, res, next) => {
  const { title, body, tokens } = req.body;

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  if (!title || !body || !tokens) {
    return next(new AppError("Please provide all required fields", 400));
  }

  for (let pushToken of tokens) {
    const data = {
      message: {
        token: pushToken,
        notification: {
          title: title,
          body: body
        },
        data: {
          title: title,
          body: body
        }
      }
    };
    try {
      adminFirebase.messaging().send(data.message);
    } catch (err) {
      console.log(err);
      console.log("Failed to send but skipping");
    }
    // .sendToDevice(pushToken, { notification: { title, body } }, options)
    // .then((response) => {
    //   console.log("Successfully sent message:", pushToken);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }
  return res.status(200).send({ message: "Notification sent successfully" });
});

const sendPushDirect = (data) => {
  const { title, body, tokens } = data;

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  if (!title || !body || !tokens) {
    return next(new AppError("Please provide all required fields", 400));
  }

  for (let pushToken of tokens) {
    const data = {
      message: {
        token: pushToken,
        notification: {
          title: title,
          body: body
        },
        data: {
          title: title,
          body: body
        }
      }
    };
    try {
      adminFirebase
        .messaging()
        .send(data.message)
        .catch((err) => {
          console.log("HERE I AM: ", err.message);
          console.log("Failed to send but skipping");
          return console.log(err);
        });
    } catch (err) {
      console.log(err);
      console.log("Failed to send but skipping");
    }
  }
};

const createPush = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message) return next(new AppError("Push files are missing", 400));

  let newPush = new Push({
    ...req.body
  });

  await newPush.save();

  // fetching push data
  return res.send({
    message: "Push created",
    registered: true
  });
});

const updatePush = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let verifyPush = await Push.findOne({ _id: id });
  if (verifyPush) {
    await Push.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...req.body
        }
      }
    );
    return res.send({ message: "Push updated successfully" });
  }
  return next(new AppError("Push not found", 400));
});

const deletePush = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let deletePush = await Push.findByIdAndDelete({ _id: id });
  if (!deletePush) return next(new AppError("Push not found", 400));
  return res.send({ message: "Push deleted successfully" });
});

const getPush = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let Pushs = await Push.findOne({ _id: id });
  if (!Pushs) return next(new AppError("Push not found", 400));
  return res.send({ push: Pushs });
});

const getAllPushs = catchAsync(async (req, res, next) => {
  let allPushs = await Push.find().sort({ _id: -1 });
  res.send({ push: allPushs });
});

const countAll = catchAsync(async (req, res, next) => {
  let allPush = await Push.countDocuments({});
  res.send({ push: allPush });
});

module.exports = {
  sendPush,
  sendPushDirect,
  createPush,
  updatePush,
  deletePush,
  getPush,
  getAllPushs,
  countAll
};
