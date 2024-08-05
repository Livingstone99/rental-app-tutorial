const router = require("express").Router();
const controller = require("../controller/inspection");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectUser, protectAdmin } = require("../handlers/authController");

router.post("/create", check_api_key, protectUser, controller.createInspection);
router.post(
  "/create-admin",
  check_api_key,
  protectAdmin,
  controller.createInspection
);
router.get(
  "/get-all",
  check_api_key,
  protectAdmin,
  controller.getAllInspections
);
router.get(
  "/get-one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificInspection
);

router.get(
  "/user_landlord/:id",
  check_api_key,
  protectUser,
  controller.findAllInspectionsByUserOrLandlord
);

router.put(
  "/update/:id",
  check_api_key,
  protectAdmin,
  controller.updateInspection
);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteInspection
);

module.exports = router;
