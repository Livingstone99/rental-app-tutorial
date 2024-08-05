const router = require("express").Router();
const controller = require("../controller/transaction");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectUser, protectAdmin } = require("../handlers/authController");

router.post(
  "/create",
  check_api_key,
  protectUser,
  controller.createTransaction
);
router.get(
  "/get-all",
  check_api_key,
  protectAdmin,
  controller.getAllTransactions
);
router.get(
  "/get-one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificTransactions
);
router.put(
  "/update/:id",
  check_api_key,
  protectUser,
  controller.updateTransaction
);
router.delete(
  "/delete/:id",
  check_api_key,
  protectAdmin,
  controller.deleteTransaction
);
router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);

module.exports = router;
