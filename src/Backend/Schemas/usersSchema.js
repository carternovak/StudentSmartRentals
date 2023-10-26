const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for the entire document (Users collection)
const usersCollectionSchema = new Schema({
  UserID: String,
  CommunityID: String,
  CommunityName: String,
  Apartment: {
    ApartmentID: String,
    ApartmentName: String,
    Unit: {
      UnitID: String,
      UnitNumber: String,
      User: {
        UserName: String,
        UserEmail: String,
        UserPhone: String,
        UserAddress: String,
      },
    },
  },
});

const UsersModel = mongoose.model("Users", usersCollectionSchema);

module.exports = UsersModel;
