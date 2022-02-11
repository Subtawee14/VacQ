const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("MONGO_URI", process.env.MONGO_URI.toString());
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
