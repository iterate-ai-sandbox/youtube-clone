require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@youtube.s8lcajd.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      waitQueueTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    }
  )
  .then(() => console.log("Connected")) //If connected to DB
  .catch((err) => console.log(err)); //If not connected to DB
