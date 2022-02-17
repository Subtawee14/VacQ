const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", auth);
app.use("/api/v1/hospitals", hospitals);

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
