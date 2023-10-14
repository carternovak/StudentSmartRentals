const mongoose = require("mongoose");

const URL = "mongodb+srv://bhaveldi:Bharath123@studentsmartrentals.ufph7vo.mongodb.net/smartrentals?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db connection success");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;