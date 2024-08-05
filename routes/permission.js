const router = require("express").Router();
const controller = require("../controller/permission");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin } = require("../handlers/authController");

router.post(
  "/create-permission",
  check_api_key,
  protectAdmin,
  controller.createPermission
);

router.put(
  "/update-permission/:id",
  check_api_key,
  protectAdmin,
  controller.updatePermission
);

router.get(
  "/get-all",
  check_api_key,
  protectAdmin,
  controller.getAllPermission
);
router.get(
  "/get-one/:id",
  check_api_key,
  protectAdmin,
  controller.getPermission
);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deletePermission
);

module.exports = router;
