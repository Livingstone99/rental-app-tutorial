const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const AUTH = (req, res, next) => {
  const token = req.header("auth-token");
  console.log("token", token);
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY, {
        algorithm: "HS256"
      });
      req.user = verified; //It stores the returned ID
      console.log(verified);
      next();
      // return res.send({ message: verified._id });
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        message: "Invalid token"
      });
    }
  } else {
    res.status(401).send({ message: "Access denied. Token required" });
  }
};

module.exports = { AUTH };
