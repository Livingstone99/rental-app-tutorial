const router = require('express').Router()
const controller = require('../controller/report')
const { AUTH } = require('../auth')
const { check_api_key } = require('../utils/check_api_key')
const { protectUser, protectAdmin } = require('../handlers/authController')

router.post(
  '/create-report',
  check_api_key,
  // protectUser,
  controller.createReport,
)
router.post(
  '/create-report-admin',
  check_api_key,
  protectAdmin,
  controller.createReport,
)

router.get('/get-all', check_api_key, protectAdmin, controller.getAllReports)

router.get(
  '/get-user/:user_id',
  check_api_key,
  protectUser,
  controller.getAllUserReport,
)

router.get(
  '/get-one/:id',
  check_api_key,
  protectUser,
  controller.getSpecificReports,
)

router.put(
  '/update-one/:id',
  check_api_key,
  protectAdmin,
  controller.updateReport,
)

router.delete(
  '/delete/:id',
  check_api_key,
  protectAdmin,
  controller.deleteReport,
)

router.get('/count-get', check_api_key, protectAdmin, controller.countDoc)

module.exports = router
