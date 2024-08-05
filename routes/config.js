const router = require("express").Router();
const controller = require("../controller/config");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/create", check_api_key, protectAdmin, controller.createConfig);
router.get("/all", check_api_key, controller.getAllConfigs);
router.get(
  "/get-all-admin",
  check_api_key,
  protectAdmin,
  controller.getAllConfigs
);
router.get(
  "/one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificConfigs
);
router.put("/update/:id", check_api_key, protectAdmin, controller.updateConfig);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteConfig
);

module.exports = router;
