require("dotenv").config(); // .env file mathi variable load karva mate
const mongoose = require("mongoose"); // MongoDB sathe connect thava mate mongoose module import kariyu

// Database sathe connect karva mate a function banavyu che
const connectDB = async () => {
  try {
    // MONGO_URI no upyog kari ne database connect karva
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Jo connection safal thay to aa message aavshe
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`); // Jo connection fail thay to aa error message aavshe
    process.exit(1); // Error aavi etle server ne bandh karva mate
  }
};

// Aa function ne bija files ma vaparva mate export karyu che
module.exports = connectDB;