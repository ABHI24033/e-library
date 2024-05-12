import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    // const connectio=
    mongoose.connection.on("connected", () => {
      console.log(`connected to mongo DB`);
    });
    mongoose.connection.on("error", (err: any) => {
      console.log(`Error in connecting with database`, err);
    });
    await mongoose.connect(config.mongouri as string);
  } catch (error) {
    console.log("Error to connect with db", error);
    process.exit(1);
  }
};

export default connectDB;
