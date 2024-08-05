const router = require("express").Router();
const controller = require("../controller/ads");
const { AUTH } = require("../auth");
const { check_api_key } = require("../utils/check_api_key");
const { protectAdmin, protectUser } = require("../handlers/authController");

router.post("/create-ad", check_api_key, protectAdmin, controller.createAd);

router.put("/update-ad/:id", check_api_key, protectAdmin, controller.updateAd);

router.get("/get-all", check_api_key, protectAdmin, controller.getAllAds);
router.get("/get-one/:id", check_api_key, protectUser, controller.getAd);
router.get("/get-actif", check_api_key, protectUser, controller.getActifAds);
router.get("/count-ad", check_api_key, protectAdmin, controller.countAll);

router.delete("/delete/:id", check_api_key, protectAdmin, controller.deleteAd);

module.exports = router;
