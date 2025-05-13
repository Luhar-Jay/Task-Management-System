import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mognodb connected");
  } catch (error) {
    console.log("Mongodb connections failed", error);
    process.exit(1);
  }
};

export default connectDB;
