const exp = require("express");
const communityModel = require("../Schemas/communitySchema");
const communityAPI = exp.Router();

// http://localhost:3000/communityData/postCommunityData

communityAPI.post("/postCommunityData", async(req, res) => {
    const communityData = new communityModel({
      CommunityID: req.body.CommunityID,
      CommunityName: req.body.CommunityName,
      CommDistanceFromCollege: req.body.CommDistanceFromCollege,
      CommStAddress: req.body.CommStAddress,
      CommCity: req.body.CommCity,
      State: req.body.State,
      Zipcode: req.body.Zipcode,
      CommLocation: {
        latitude: req.body.CommLocation.latitude,
        longitude: req.body.CommLocation.longitude,
      },
      BusesToCollege: req.body.BusesToCollege,
      CommunityRules: req.body.CommunityRules,
      CommunityFeatures: req.body.CommunityFeatures,
      CommApartments: [
        {
          ApartmentID: req.body.CommApartments[0].ApartmentID,
          AptName: req.body.CommApartments[0].AptName,
          AptUnits: [
            {
              UnitNumber: req.body.CommApartments[0].AptUnits[0].UnitNumber,
              UnitPrice: req.body.CommApartments[0].AptUnits[0].UnitPrice,
              Bedrooms: req.body.CommApartments[0].AptUnits[0].Bedrooms,
              Bathrooms: req.body.CommApartments[0].AptUnits[0].Bathrooms,
              SQFT: req.body.CommApartments[0].AptUnits[0].SQFT,
              IsAvailable: req.body.CommApartments[0].AptUnits[0].IsAvailable,
              Leaseperiod: req.body.CommApartments[0].AptUnits[0].Leaseperiod,
              UnitModeling: {
                Old: req.body.CommApartments[0].AptUnits[0].UnitModeling.Old,
                New: req.body.CommApartments[0].AptUnits[0].UnitModeling.New,
                remodeled: req.body.CommApartments[0].AptUnits[0].UnitModeling.remodeled,
              },
              Unit_Images: req.body.CommApartments[0].AptUnits[0].Unit_Images,
              HomeTourLink: req.body.CommApartments[0].AptUnits[0].HomeTourLink,
              UnitFeatures: req.body.CommApartments[0].AptUnits[0].UnitFeatures,
            },
          ],
        },
      ],
    }
    )
    const val = await communityData.save();
    res.json(val);
})


module.exports = communityAPI;