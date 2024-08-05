const router = require("express").Router();
const controller = require("../controller/category");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post(
  "/create-category",
  check_api_key,
  protectAdmin,
  controller.createCategory
);
router.put(
  "/update-category/:id",
  check_api_key,
  protectAdmin,
  controller.updateCategory
);
router.get("/get-all", check_api_key, protectAdmin, controller.getAllCategory);

router.get(
  "/get-actif",
  check_api_key,
  // protectUser,
  controller.getActifCategory
);

router.get("/get-one/:id", check_api_key, protectUser, controller.getCategory);

router.delete("/delete/:id", protectAdmin, controller.deleteCategory);

module.exports = router;
