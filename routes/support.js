const router = require("express").Router();
const controller = require("../controller/support");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectUser, protectAdmin } = require("../handlers/authController");

router.post(
  "/create-support",
  check_api_key,
  protectUser,
  controller.createSupport
);
router.post(
  "/create-support-admin",
  check_api_key,
  protectAdmin,
  controller.createSupport
);
router.get("/get-all", check_api_key, protectAdmin, controller.getAllSupports);
router.get(
  "/get-landlord/:id",
  check_api_key,
  protectUser,
  controller.getAllLandlordSupport
);
router.get(
  "/get-user/:id",
  check_api_key,
  protectUser,
  controller.getAllUserSupport
);
router.get(
  "/get-one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificSupports
);
router.put(
  "/update-one/:id",
  check_api_key,
  protectAdmin,
  controller.updateSupport
);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteSupport
);
router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);

module.exports = router;
