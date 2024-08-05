const router = require("express").Router();
const controller = require("../controller/property");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectUser, protectAdmin } = require("../handlers/authController");

router.post("/create", check_api_key, protectUser, controller.createProperty);

router.post(
  "/create-admin",
  check_api_key,
  protectAdmin,
  controller.createProperty
);

router.get("/get-all", check_api_key, controller.getActifProperties);

router.get(
  "/get-city/:city",
  check_api_key,
  controller.getActifPerCityProperties
);

router.get(
  "/get-all-admin",
  check_api_key,
  protectAdmin,
  controller.getAllProperties
);

router.get(
  "/get-all-landlord/:id",
  check_api_key,
  protectUser,
  controller.getLandlordProperties
);

router.get(
  "/get-one/:id",
  check_api_key,
  // protectUser,
  controller.getSpecificProperty
);

router.put("/update/:id", protectUser, controller.updateProperty);

router.put("/update-admin/:id", protectAdmin, controller.updateProperty);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteProperty
);

module.exports = router;
