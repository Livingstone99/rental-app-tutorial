const router = require("express").Router();
const controller = require("../controller/discount");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post(
  "/create-discount",
  check_api_key,
  protectAdmin,
  controller.createDiscount
);

router.put(
  "/update-discount/:id",
  check_api_key,
  protectAdmin,
  controller.updateDiscount
);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllDiscounts);

router.get("/get-one/:id", check_api_key, protectUser, controller.getDiscount);
router.get(
  "/get-actif",
  check_api_key,
  protectUser,
  controller.getActifDiscounts
);
router.get("/count-discount", check_api_key, protectAdmin, controller.countAll);

router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteDiscount
);

module.exports = router;
