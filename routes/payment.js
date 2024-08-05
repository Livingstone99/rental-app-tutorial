const router = require("express").Router();
const controller = require("../controller/payment");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/booking/callback-payment", controller.callbackPayment);
router.post(
  "/booking/callback-payment-inspection",
  controller.callbackPaymentInspection
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllPayments);
router.get(
  "/get-one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificPayment
);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deletePayment
);
router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);

module.exports = router;
