import mongoose from "mongoose";
import { config } from "../config/config.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    if (!config.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
