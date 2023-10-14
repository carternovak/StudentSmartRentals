const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    UnitNumber: String,
    UnitPrice: Number,
    Bedrooms: Number,
    Bathrooms: Number,
    SQFT: Number,
    IsAvailable: Boolean,
    Leaseperiod: Number,
    UnitModeling: {
      Old: Boolean,
      New: Boolean,
      remodeled: Boolean,
    },
    Unit_Images: [String],
    HomeTourLink: String,
    UnitFeatures: [String],
  });
  
  const apartmentSchema = new mongoose.Schema({
    ApartmentID: String,
    AptName: String,
    AptUnits: [unitSchema],
  });
  
  const communitySchema = new mongoose.Schema({
    CommunityID: String,
    CommunityName: String,
    CommDistanceFromCollege: Number,
    CommStAddress: String,
    CommCity: String,
    State: String,
    Zipcode: String,
    CommLocation: {
      latitude: Number,
      longitude: Number,
    },
    BusesToCollege: [Number],
    CommunityRules: [String],
    CommunityFeatures: [String],
    CommApartments: [apartmentSchema],
  });

const communityModel = mongoose.model("communities", communitySchema)

module.exports = communityModel;