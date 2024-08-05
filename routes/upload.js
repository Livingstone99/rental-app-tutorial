const router = require("express").Router();
const controller = require("../controller/upload");
const { check_api_key } = require("../utils/check_api_key");

router.post(
  "/create-url-web",
  check_api_key,
  // decryptData,
  controller.createUrlWeb
);
router.post(
  "/create-url-mobile",
  check_api_key,
  // decryptData,
  controller.createUrlMobile
);

router.delete("/delete/:id", check_api_key, controller.deleteUrl);

module.exports = router;
