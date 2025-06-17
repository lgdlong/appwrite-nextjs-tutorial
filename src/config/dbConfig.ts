import mongoose from "mongoose";

export async function connectToDatabase() {
  const DB_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

  try {
    if (!DB_URI) {
      throw new Error("Missing MONGO_URL in .env");
    }

    await mongoose.connect(DB_URI);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
