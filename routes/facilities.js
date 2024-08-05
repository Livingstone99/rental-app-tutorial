const router = require("express").Router();
const controller = require("../controller/facilities");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/create", check_api_key, protectAdmin, controller.createFacility);
router.post(
  "/create-many",
  check_api_key,
  protectAdmin,
  controller.createManyFacilities
);
router.get("/all", check_api_key, protectAdmin, controller.getAllFacilitys);
router.get(
  "/one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificFacilitys
);
router.get(
  "/get-actif",
  check_api_key,
  // protectUser,
  controller.getActifFacility
);
router.put(
  "/update/:id",
  check_api_key,
  protectAdmin,
  controller.updateFacility
);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteFacility
);

module.exports = router;
