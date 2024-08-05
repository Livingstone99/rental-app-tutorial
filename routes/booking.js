const router = require("express").Router();
const controller = require("../controller/booking");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectUser, protectAdmin } = require("../handlers/authController");

router.post("/create", check_api_key, protectUser, controller.createBooking);
router.post(
  "/create-admin",
  check_api_key,
  protectAdmin,
  controller.createBooking
);
router.get("/all", check_api_key, protectUser, controller.getAllBookings);
router.get(
  "/get-all-admin",
  check_api_key,
  protectAdmin,
  controller.getAllBookings
);
router.get(
  "/one/:id",
  check_api_key,
  protectUser,
  controller.getSpecificBookings
);
router.put(
  "/rate-booking/:id",
  check_api_key,
  protectUser,
  controller.rateLandlord
);
router.get(
  "/user-landlord/:id",
  check_api_key,
  protectUser,
  controller.findAllBookingbyUserOrLandlord
);

router.get(
  "/user-booked/:id",
  check_api_key,
  protectUser,
  controller.findAllBookingbyUser
);

router.get(
  "/get-all-booking-rate-from-property/:id",
  check_api_key,
  controller.getAllRatingFromABookedProperty
);

router.put("/update/:id", check_api_key, protectUser, controller.updateBooking);
router.put(
  "/update-admin/:id",
  check_api_key,
  protectAdmin,
  controller.updateBooking
);
router.delete(
  "/delete/:id",
  check_api_key,
  protectUser,
  controller.deleteBooking
);
router.delete(
  "/delete-admin/:id",
  check_api_key,
  protectAdmin,
  controller.deleteBooking
);
router.get("/count-get", check_api_key, protectAdmin, controller.countDoc);

module.exports = router;
