const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  handler: function (req, res, next) {
    return res
      .status(429)
      .send({ message: "Veuillez ressayer après 10 minutes" });
  }
});

module.exports = {
  limiter
};
