import app from "./app.js";
import cloudinary from 'cloudinary';
import { connectDatabase } from "./Config/database.js";
import { config } from "dotenv";

config({
  path:"backend/Config/config.env",
});

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

connectDatabase();

cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(process.env.PORT, () => {
  console.log(`SERVER IS WORKING ON PORT : ${process.env.PORT}`);
 });


//unhandled promise rejjection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });