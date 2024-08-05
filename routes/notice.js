const router = require("express").Router();
const controller = require("../controller/notice");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post(
  "/create-notice",
  check_api_key,
  protectAdmin,
  controller.createNotice
);

router.put(
  "/update-notice/:id",
  check_api_key,
  protectAdmin,
  controller.updateNotice
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllNotices);
router.get("/get-one/:id", check_api_key, protectUser, controller.getNotice);
router.get(
  "/get-actif",
  check_api_key,
  protectUser,
  controller.getActifNotices
);
router.get("/count-notice", check_api_key, protectAdmin, controller.countAll);

router.delete("/delete/:id", check_api_key, protectAdmin, controller.deleteNotice);

module.exports = router;
