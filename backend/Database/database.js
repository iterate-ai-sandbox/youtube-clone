require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_user.trim()}:${process.env.DB_password.trim()}@youtube.s8lcajd.mongodb.net/${process.env.DB_name.trim()}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      waitQueueTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    }
  );
};

module.exports = connectDB;
