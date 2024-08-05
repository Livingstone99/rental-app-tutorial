const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIO = require("socket.io");
const http = require("http");
const redisAdapter = require("socket.io-redis");
const hpp = require("hpp");
const rfs = require("rotating-file-stream");
const path = require("path");
var bodyParser = require("body-parser");

var fileupload = require("express-fileupload");

require("dotenv").config({ path: path.join(__dirname, ".env") });

// scripts importation
const initialAdmin = require("./scripts/initial-admin");
const initialSetting = require("./scripts/initial-setting");
const initialUser = require("./scripts/initial-user");

// Handlers importation

const { AppError } = require("./utils/appError");
const globalErrorHandler = require("./handlers/global-error-controller");

//Routes import
const Ads = require("./routes/ads");
const Users = require("./routes/user");
const Discount = require("./routes/discount");
const City = require("./routes/city");
const Category = require("./routes/category");
const Booking = require("./routes/booking");
const Support = require("./routes/support");
const Admin = require("./routes/admin");
const Permission = require("./routes/permission");
const Role = require("./routes/role");
const Push = require("./routes/push");
const Transaction = require("./routes/transaction");
const Notice = require("./routes/notice");
const Config = require("./routes/config");
const Facility = require("./routes/facilities");
const Property = require("./routes/property");
const Inspection = require("./routes/inspection");
const Payment = require("./routes/payment");
const Report = require("./routes/report");
const Notification = require("./routes/notification");

//Upload
const Upload = require("./routes/upload");
const { failedPayment, successfulPayment } = require("./controller/payment");

const app = express();

// Set the view engine to Pug
app.set("view engine", "pug");

// const url = "mongodb://ibearth2025:CisseIbrahim2017@75.119.139.246:27017/?authSource=admin";

// Serve static files from the "public" directory
app.use(express.static("public"));

// var accessLogStream = rfs.createStream("access.log", {
//   interval: "1d", // rotate daily
//   path: path.join(__dirname, "log")
// });

// const server = http.createServer(app);
// const io = socketIO(server, { origins: "*:*" });
// io.on("connection", (socket) => {
//   socket.emit("connected", { data: "wow," });
// });

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log("Unhandled rejection: 🔥💥 Shutting down");
  process.exit(1);
});

dotenv.config();

// DB configuration
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
// console.log("process.env.NODE_ENV");
// console.log(process.env.MONGODB_REMOTE);

mongoose
  .connect(
    process.env.ENVIRON === "dev-remote"
      ? process.env.MONGODB_REMOTE
      : process.env.MONGODB_LOCAL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Production DB connected");
  });

// Subscribing to unhandledRejections
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log("Unhandled rejection: 🔥💥 Shutting down");
  process.exit(1);
});

// scripts running
initialAdmin.init();
initialSetting.init();
initialUser.init();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(logger("dev"));
app.use(express.static(__dirname + "/static"));
app.use(fileupload());
app.use(bodyParser.json({ limit: "200mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true
  })
);

// app.use(
//   logger(
//     ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms USER_AGENT: :user-agent TOTAL_TIME: :total-time ms    DATE: :date",
//     { stream: accessLogStream }
//   )
// );
app.use(`/v0/welcome`, (req, res, next) => {
  res.send({
    name: "stonestack"
  });
});

app.set("strict routing", true);

// app.use(`/v0/payment/success`, successfulPayment);

// app.use(`/v0/payment/failed`, failedPayment);

// Routers
app.use("/v0/user", Users);
app.use("/v0/ads", Ads);
app.use("/v0/discount", Discount);
app.use("/v0/support", Support);
app.use("/v0/city", City);
app.use("/v0/category", Category);
app.use("/v0/booking", Booking);
app.use("/v0/property", Property);
app.use("/v0/push", Push);
app.use("/v0/admin", Admin);
app.use("/v0/permission", Permission);
app.use("/v0/role", Role);
app.use("/v0/transaction", Transaction);
app.use("/v0/config", Config);
app.use("/v0/facility", Facility);
app.use("/v0/inspection", Inspection);
app.use("/v0/payment", Payment);
app.use("/v0/report", Report);
app.use("/v0/notification", Notification);
app.use("/v0/notice", Notice);

//upload
app.use("/v0/upload", Upload);

const port = process.env.PORT || 3000;

let server = app.listen(port, () => {
  console.log(`Listening on Port ${port} PIPELINE OK`);
});

app.use(globalErrorHandler);
