const router = require("express").Router();
const controller = require("../controller/city");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/create-city", check_api_key, protectAdmin, controller.createCity);
router.put(
  "/update-city/:id",
  check_api_key,
  protectAdmin,
  controller.updateCity
);
router.get("/get-all", check_api_key, protectAdmin, controller.getAllCity);
router.get("/get-actif", check_api_key, controller.getActifCity);
router.get("/get-one/:id", check_api_key, protectUser, controller.getCity);

router.delete("/delete/:id", protectAdmin, controller.deleteCity);

module.exports = router;
