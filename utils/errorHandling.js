function errorHandling(res, extra) {
  return res.status(extra.status).send({ ...extra });
}

module.exports = { errorHandling };
