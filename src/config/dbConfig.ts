// src/config/dbConfig.ts
import mongoose from "mongoose";

// Global variable to track connection status
declare global {
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize the global connection objects
global.mongooseConnection = global.mongooseConnection || {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  const DB_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

  try {
    if (!DB_URI) {
      throw new Error("Missing MONGO_URI in .env");
    } // If connection exists, return it
    if (global.mongooseConnection.conn) {
      console.log("Using existing database connection");
      return global.mongooseConnection.conn;
    }

    // If a connection is in progress, wait for it
    if (!global.mongooseConnection.promise) {
      console.log("Creating new database connection");

      // Connection options to avoid deprecation warnings
      const options = {
        // These options improve connection stability in production
        bufferCommands: false,
      };

      // Store the connection promise
      global.mongooseConnection.promise = mongoose.connect(DB_URI, options);
    }

    // Wait for the connection to resolve
    global.mongooseConnection.conn = await global.mongooseConnection.promise;
    console.log("Connected to MongoDB successfully");
    return global.mongooseConnection.conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
