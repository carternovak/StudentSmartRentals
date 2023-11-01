const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Unit Owners
const unitOwnerSchema = new Schema({
  UnitID: String,
  UnitOwnerName: String,
  UnitOwnerEmail: String,
  UnitOwnerPhone: String,
  UnitOwnerAddress: String,
});

const ownerinApartmentSchema = new mongoose.Schema({
  ApartmentID: String,
  AptName: String,
  AptUnit: unitOwnerSchema,
});

const OwnerInCommunitySchema = new Schema({
  UnitOwnerID: String,
  CommunityID: String,
  CommunityName: String,
  UnitOwner: ownerinApartmentSchema, // Array of Unit Owners
});

const CommunityOwnerModel = mongoose.model("owners", OwnerInCommunitySchema);

module.exports = CommunityOwnerModel;
