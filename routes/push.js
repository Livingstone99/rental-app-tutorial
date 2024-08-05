const router = require("express").Router();
const controller = require("../controller/push");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin } = require("../handlers/authController");

router.post("/send-push", check_api_key, controller.sendPush);
router.post("/create-push", check_api_key, protectAdmin, controller.createPush);

router.put(
  "/update-push/:id",
  check_api_key,
  protectAdmin,
  controller.updatePush
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllPushs);
router.get("/get-one/:id", check_api_key, protectAdmin, controller.getPush);
router.get("/count-push", check_api_key, protectAdmin, controller.countAll);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deletePush
);

module.exports = router;
