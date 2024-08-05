const router = require("express").Router();
const controller = require("../controller/user");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { limiter } = require("../handlers/brufe-force");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/access-user", check_api_key, limiter, controller.accessUser);
router.post(
  "/access-number-user",
  check_api_key,
  limiter,
  controller.accessNumberUser
);
router.post(
  "/login-anonymous-user",
  check_api_key,
  limiter,
  controller.loginAnonymousUser
);

router.post("/send-otp", check_api_key, limiter, controller.sendOTP);
router.post("/verify-otp", check_api_key, limiter, controller.verifyOTP);

router.post(
  "/send-email-otp",
  check_api_key,
  limiter,
  controller.sendEmailOtpNewUser
);
router.post(
  "/verify-email-otp",
  check_api_key,
  limiter,
  controller.verifyEmailOTP
);

router.put(
  "/update-one/:id",
  check_api_key,
  protectUser,
  controller.updateUser
);
router.put(
  "/update-one-admin/:id",
  check_api_key,
  protectAdmin,
  controller.updateUser
);
router.put(
  "/update-payment/:id",
  check_api_key,
  protectUser,
  controller.updatePayment
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllUsers);
router.get(
  "/get-all-landlord",
  check_api_key,
  protectAdmin,
  controller.getAllLanlords
);
router.get("/one/:id", check_api_key, protectUser, controller.getUser);
router.get(
  "/check-verification/:id",
  check_api_key,
  protectUser,
  controller.checkVerified
);
router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteUser
);

module.exports = router;
