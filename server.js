const express = require("express");
require("dotenv").config({ path: "./config/config.env" });
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const connectDB = require("./config/db");
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");
connectDB();

const app = express();

app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10 mins
  max: 1,
});
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/auth", auth);
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/appointments", appointments);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: 1 },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀🚀🚀🚀🚀 Server started on port ${PORT} 🚀🚀🚀🚀🚀`)
);
