const router = require("express").Router();
const controller = require("../controller/admin");
// const { AUTH } = require("../auth");
const { limiter } = require("../handlers/brufe-force");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin } = require("../handlers/authController");

router.post(
  "/create-admin",
  limiter,
  check_api_key,
  protectAdmin,
  controller.createAdmin
);

router.post("/login-admin", limiter, check_api_key, controller.loginAdmin);

router.put(
  "/update-admin/:id",
  check_api_key,
  protectAdmin,
  controller.updateAdmin
);

router.put(
  "/update-password/:id",
  check_api_key,
  protectAdmin,
  controller.updatePassword
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllAdmin);
router.get("/get-one/:id", check_api_key, protectAdmin, controller.getAdmin);
router.get(
  "/check-admin/:id",
  check_api_key,
  protectAdmin,
  controller.checkAdmin
);
router.get("/count-admin", check_api_key, protectAdmin, controller.countAll);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteAdmin
);

module.exports = router;
