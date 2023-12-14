// mongooseConnection.js
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

async function connectToMongoDB() {
  //const connectionString = "mongodb://localhost:27017/your-database-name";
  return mongoose.connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.ufr2nrv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );
}

// Export the function for use in other files
module.exports = connectToMongoDB;
