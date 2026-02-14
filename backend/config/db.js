/*
  config/db.js - MongoDB Connection
  =================================================================================
  PURPOSE:
  - Connect to MongoDB using Mongoose
  - Called once on server startup from index.js
  
  EXPORTED FUNCTION:
  - connectDb(): Async function that connects to MongoDB using process.env.MONGODB_URL
  
  ERROR HANDLING:
  - On connection failure, logs error and exits process (process.exit(1))
  - This ensures the server doesn't run without a database connection
=================================================================================
*/
import mongoose from "mongoose";

const connectDb=async ()=>{
    try {
      await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch (error) {
        console.error("db connection error:", error);
        process.exit(1);
    }
}
export default connectDb