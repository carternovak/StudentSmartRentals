const exp = require("express");
const communityOwnerModel = require("../Schemas/ownersSchema");
const ownerAPI = exp.Router();

// http://localhost:3000/ownerData/postOwnerData

ownerAPI.post("/postOwnerData", async (req, res) => {
  const ownerData = new communityOwnerModel({
    UnitOwnerID: req.body.UnitOwnerID,
    CommunityID: req.body.CommunityID,
    CommunityName: req.body.CommunityName,
    UnitOwner: {
      ApartmentID: req.body.UnitOwner.ApartmentID,
      AptName: req.body.UnitOwner.AptName,
      AptUnit: {
        UnitID: req.body.UnitOwner.AptUnit.UnitID,
        UnitOwnerName: req.body.UnitOwner.AptUnit.UnitOwnerName,
        UnitOwnerEmail: req.body.UnitOwner.AptUnit.UnitOwnerEmail,
        UnitOwnerPhone: req.body.UnitOwner.AptUnit.UnitOwnerPhone,
        UnitOwnerAddress: req.body.UnitOwner.AptUnit.UnitOwnerAddress,
      },
    },
  });
  const val = await ownerData.save();
  res.json(val);
});

// http://localhost:3000/ownerData/getAllOwnersData
ownerAPI.get("/getAllOwnersData", async (req, res) => {
  try {
    const ownersdata = await communityOwnerModel.find();
    if (!ownersdata) {
      return res.status(404).json({ error: "No Owners found" });
    }
    res.json(ownersdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/ownerData/getAllOwnersData/:ownerId

ownerAPI.get("/getAllOwnersData/:ownerId", async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    const ownerdata = await communityOwnerModel.findOne({
      UnitOwnerID: ownerId,
    });
    if (!ownerdata) {
      return res.status(404).json({ error: "Owner not found" });
    }
    res.json(ownerdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/ownerData/updateOwnersData/:ownerId
ownerAPI.put("/updateOwnersData/:ownerId", async (req, res) => {
  const ownerId = req.params.ownerId;
  const updatedetails = req.body;

  const updateOwnerData = async (commId, updatedetails) => {
    try {
      // Find the community document by ID
      const owner = await communityOwnerModel.findOne({ UnitOwnerID: ownerId });

      if (owner) {
        if (updatedetails.UnitOwnerID !== undefined) {
          owner.UnitOwnerID = updatedetails.UnitOwnerID;
        }

        if (updatedetails.CommunityID !== undefined) {
          owner.CommunityID = updatedetails.CommunityID;
        }
        if (updatedetails.CommunityName !== undefined) {
          owner.CommunityName = updatedetails.CommunityName;
        }
        if (updatedetails.ApartmentID !== undefined) {
          owner.UnitOwner.ApartmentID = updatedetails.ApartmentID;
        }
        if (updatedetails.AptName !== undefined) {
          owner.UnitOwner.AptName = updatedetails.AptName;
        }
        if (updatedetails.UnitID !== undefined) {
          owner.UnitOwner.AptUnit.UnitID = updatedetails.UnitID;
        }
        if (updatedetails.UnitOwnerName !== undefined) {
          owner.UnitOwner.AptUnit.UnitOwnerName = updatedetails.UnitOwnerName;
        }
        if (updatedetails.UnitOwnerEmail !== undefined) {
          owner.UnitOwner.AptUnit.UnitOwnerEmail = updatedetails.UnitOwnerEmail;
        }
        if (updatedetails.UnitOwnerPhone !== undefined) {
          owner.UnitOwner.AptUnit.UnitOwnerPhone = updatedetails.UnitOwnerPhone;
        }
        if (updatedetails.UnitUnitOwnerAddressOwnerID !== undefined) {
          owner.UnitOwner.AptUnit.UnitOwnerAddress =
            updatedetails.UnitOwnerAddress;
        }

        const updateowner = await owner.save();
        return updateowner;
      } else {
        return null; // Community not found
      }
    } catch (error) {
      console.error(error);
      throw error; // Handle the error appropriately in your application
    }
  };

  const updatedOwner = await updateOwnerData(ownerId, updatedetails);
  if (updatedOwner) {
    res.json(updatedOwner);
  } else {
    res.status(404).json({ error: "Owner not found" });
  }
});

// http://localhost:3000/ownerData/deleteOwnersData/:ownerId
ownerAPI.delete("/deleteOwnersData/:ownerId", async (req, res) => {
  const ownerId = req.params.ownerId;
  try {
    const deletedUser = await communityOwnerModel.deleteOne({
      UnitOwnerID: ownerId,
    });
    if (deletedUser.deletedCount === 1) {
      res.json({ message: "Owner deleted successfully" });
    } else {
      res.status(404).json({ error: "Owner not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = ownerAPI;
