const router = require("express").Router();
const controller = require("../controller/notification");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post(
  "/create-notification",
  check_api_key,
  protectAdmin,
  controller.createNotification
);

router.get(
  "/get-all",
  check_api_key,
  protectAdmin,
  controller.getAllNotifications
);

router.get(
  "/get-landlord/:id",
  check_api_key,
  protectUser,
  controller.getAllLandlordNotification
);

router.get(
  "/get-user/:id",
  check_api_key,
  protectUser,
  controller.getAllUserNotification
);

router.get(
  "/get-one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificNotifications
);

router.put(
  "/update-one/:id",
  check_api_key,
  protectUser,
  controller.updateNotification
);

router.put(
  "/update-many",
  check_api_key,
  protectUser,
  controller.updateManyNotification
);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteNotification
);

router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);

module.exports = router;
