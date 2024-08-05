const router = require("express").Router();
const controller = require("../controller/role");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin } = require("../handlers/authController");

router.post("/create-role", check_api_key, protectAdmin, controller.createRole);

router.put(
  "/update-role/:id",
  check_api_key,
  protectAdmin,
  controller.updateRole
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllRole);
router.get("/get-one/:id", check_api_key, protectAdmin, controller.getRole);

router.delete("/delete/:id", protectAdmin, controller.deleteRole);

module.exports = router;
