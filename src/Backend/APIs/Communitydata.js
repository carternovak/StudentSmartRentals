const exp = require("express");
const communityModel = require("../Schemas/communitySchema");
const communityAPI = exp.Router();

// http://localhost:5000/communityData/getAllCommunityData
communityAPI.get("/getAllCommunityData", async (req, res) => {
  try {
    const data = await communityModel.find();
    if (!data) {
      return res.status(404).json({ error: "No Communities found" });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:5000/communityData/getAllCommunityData/:communityId
communityAPI.get("/getAllCommunityData/:communityId", async (req, res) => {
  const commId = req.params.communityId;
  try {
    const data = await communityModel.findOne({ CommunityID: commId });
    if (!commId) {
      return res.status(404).json({ error: "Community not found" });
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:5000/communityData/updateCommunityData/:communityId
communityAPI.put("/updateCommunityData/:communityId", async (req, res) => {
  const commId = req.params.communityId;
  const updatedetails = req.body;

  const updateCommunityData = async (commId, updatedetails) => {
    try {
      // Find the community document by ID
      const community = await communityModel.findOne({ CommunityID: commId });

      if (community) {
        if (updatedetails.CommunityID !== undefined) {
          community.CommunityID = updatedetails.CommunityID;
        }
        if (updatedetails.CommunityName !== undefined) {
          community.CommunityName = updatedetails.CommunityName;
        }
        if (updatedetails.CommDistanceFromCollege !== undefined) {
          community.CommDistanceFromCollege =
            updatedetails.CommDistanceFromCollege;
        }
        if (updatedetails.CommStAddress !== undefined) {
          community.CommStAddress = updatedetails.CommStAddress;
        }
        if (updatedetails.CommCity !== undefined) {
          community.CommCity = updatedetails.CommCity;
        }
        if (updatedetails.State !== undefined) {
          community.State = updatedetails.State;
        }
        if (updatedetails.Zipcode !== undefined) {
          community.Zipcode = updatedetails.Zipcode;
        }
        if (updatedetails.CommLocation !== undefined) {
          community.CommLocation = {
            latitude: updatedetails.CommLocation.latitude,
            longitude: updatedetails.CommLocation.longitude,
          };
        }
        if (updatedetails.BusesToCollege !== undefined) {
          community.BusesToCollege = updatedetails.BusesToCollege;
        }
        if (updatedetails.CommunityRules !== undefined) {
          community.CommunityRules = updatedetails.CommunityRules;
        }
        if (updatedetails.CommunityFeatures !== undefined) {
          community.CommunityFeatures = updatedetails.CommunityFeatures;
        }
        if (updatedetails.ApartmentID !== undefined) {
          community.CommApartments.ApartmentID = updatedetails.ApartmentID;
        }
        if (updatedetails.AptName !== undefined) {
          community.CommApartments.AptName = updatedetails.AptName;
        }

        if (updatedetails.UnitNumber !== undefined) {
          community.CommApartments.AptUnits.UnitNumber =
            updatedetails.UnitNumber;
        }
        if (updatedetails.UnitPrice !== undefined) {
          community.CommApartments.AptUnits.UnitPrice = updatedetails.UnitPrice;
        }
        if (updatedetails.Bedrooms !== undefined) {
          community.CommApartments.AptUnits.Bedrooms = updatedetails.Bedrooms;
        }
        if (updatedetails.Bathrooms !== undefined) {
          community.CommApartments.AptUnits.Bathrooms = updatedetails.Bathrooms;
        }
        if (updatedetails.SQFT !== undefined) {
          community.CommApartments.AptUnits.SQFT = updatedetails.SQFT;
        }
        if (updatedetails.IsAvailable !== undefined) {
          community.CommApartments.AptUnits.IsAvailable =
            updatedetails.IsAvailable;
        }
        if (updatedetails.Leaseperiod !== undefined) {
          community.CommApartments.AptUnits.Leaseperiod =
            updatedetails.Leaseperiod;
        }

        if (updatedetails.Old !== undefined) {
          community.CommApartments.AptUnits.UnitModeling.Old =
            updatedetails.Old == "true" ? true : false;
        }
        if (updatedetails.New !== undefined) {
          community.CommApartments.AptUnits.UnitModeling.New =
            updatedetails.New == "true" ? true : false;
        }
        if (updatedetails.remodeled !== undefined) {
          community.CommApartments.AptUnits.UnitModeling.remodeled =
            updatedetails.remodeled == "true" ? true : false;
        }

        if (updatedetails.Unit_Images !== undefined) {
          community.CommApartments.AptUnits.Unit_Images =
            updatedetails.Unit_Images;
        }

        if (updatedetails.HomeTourLink !== undefined) {
          community.CommApartments.AptUnits.HomeTourLink =
            updatedetails.HomeTourLink;
        }

        if (updatedetails.UnitFeatures !== undefined) {
          community.CommApartments.AptUnits.UnitFeatures =
            updatedetails.UnitFeatures;
        }

        const updatedCommunity = await community.save();
        return updatedCommunity;
      } else {
        return null; // Community not found
      }
    } catch (error) {
      console.error(error);
      throw error; // Handle the error appropriately in your application
    }
  };

  const updatedCommunity = await updateCommunityData(commId, updatedetails);
  if (updatedCommunity) {
    res.json(updatedCommunity);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});

// http://localhost:5000/communityData/deleteCommunityData/:communityId
communityAPI.delete("/deleteCommunityData/:communityId", async (req, res) => {
  const commId = req.params.communityId;
  try {
    const deletedUser = await communityModel.deleteOne({ CommunityID: commId });
    if (deletedUser.deletedCount === 1) {
      res.json({ message: "Community deleted successfully" });
    } else {
      res.status(404).json({ error: "Community not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:5000/communityData/postCommunityData

communityAPI.post("/postCommunityData", async (req, res) => {
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
    CommApartments: {
      ApartmentID: req.body.CommApartments.ApartmentID,
      AptName: req.body.CommApartments.AptName,
      AptUnits: {
        UnitNumber: req.body.CommApartments.AptUnits.UnitNumber,
        UnitPrice: req.body.CommApartments.AptUnits.UnitPrice,
        Bedrooms: req.body.CommApartments.AptUnits.Bedrooms,
        Bathrooms: req.body.CommApartments.AptUnits.Bathrooms,
        SQFT: req.body.CommApartments.AptUnits.SQFT,
        IsAvailable: req.body.CommApartments.AptUnits.IsAvailable,
        Leaseperiod: req.body.CommApartments.AptUnits.Leaseperiod,
        UnitModeling: {
          Old: req.body.CommApartments.AptUnits.UnitModeling.Old,
          New: req.body.CommApartments.AptUnits.UnitModeling.New,
          remodeled: req.body.CommApartments.AptUnits.UnitModeling.remodeled,
        },
        Unit_Images: req.body.CommApartments.AptUnits.Unit_Images,
        HomeTourLink: req.body.CommApartments.AptUnits.HomeTourLink,
        UnitFeatures: req.body.CommApartments.AptUnits.UnitFeatures,
      },
    },
  });
  const val = await communityData.save();
  res.json("Posted and saved in Database successfully");
});

module.exports = communityAPI;
