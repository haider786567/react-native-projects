import mongoose from "mongoose";

export const ConnectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};
