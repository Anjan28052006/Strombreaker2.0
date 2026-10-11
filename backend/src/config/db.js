const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("[Database] MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    throw error;
  }
}

async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("[Database] MongoDB disconnected");
  }
}

module.exports = { connectDB, disconnectDB };
