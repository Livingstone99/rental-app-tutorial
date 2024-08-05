const env = process.env;

const check_api_key = (req, res, next) => {
  const { session } = req.headers;

  // console.log(req.headers);

  if (!session) {
    console.log("1");
    return res.status(401).send({
      message: "you are not authorized"
    });
  }

  if (env.API_KEY !== session) {
    console.log("2");
    return res.status(401).send({
      message: "Invalid access key, you are not authorized"
    });
  }

  next();
};

module.exports = {
  check_api_key
};
