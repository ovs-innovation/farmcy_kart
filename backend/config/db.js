
require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables. Please set MONGO_URI in your .env file.");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.log("mongodb connection failed!", err.message);
    throw err;
  }
};

// Create separate MongoDB connection for modules that need it
// This is a separate connection from the main one above
let mongo_connection = null;
if (process.env.MONGO_URI) {
  try {
    mongo_connection = mongoose.createConnection(process.env.MONGO_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      keepAlive: 1,
      poolSize: 100,
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });

    mongo_connection.on("error", (err) => {
      console.error("⚠️ Secondary MongoDB connection error:", err.message);
    });

    mongo_connection.on("connected", () => {
      console.log("✅ Secondary MongoDB connected!");
    });
  } catch (err) {
    console.warn("Warning: Could not create separate MongoDB connection:", err.message);
  }
}

module.exports = {
  connectDB,
  mongo_connection,
};
