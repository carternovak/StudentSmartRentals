const exp = require("express");
const usersModel = require("../Schemas/usersSchema");
const usersAPI = exp.Router();

// http://localhost:3000/userData/postUsersData

usersAPI.post("/postUsersData", async (req, res) => {
  const userData = new usersModel({
    UserID: req.body.UserID,
    CommunityID: req.body.CommunityID,
    CommunityName: req.body.CommunityName,
    Apartment: {
      ApartmentID: req.body.Apartment.ApartmentID,
      ApartmentName: req.body.Apartment.ApartmentName,
      Unit: {
        UnitID: req.body.Apartment.Unit.UnitID,
        UnitNumber: req.body.Apartment.Unit.UnitNumber,
        User: {
          UserName: req.body.Apartment.Unit.User.UserName,
          UserEmail: req.body.Apartment.Unit.User.UserEmail,
          UserPhone: req.body.Apartment.Unit.User.UserPhone,
          UserAddress: req.body.Apartment.Unit.User.UserAddress,
        },
      },
    },
  });

  const val = await userData.save();
  res.json(val);
});

// http://localhost:3000/userData/getAllUsersData
usersAPI.get("/getAllUsersData", async (req, res) => {
  try {
    const usersdata = await usersModel.find();
    if (!usersdata) {
      return res.status(404).json({ error: "No Users found" });
    }
    res.json(usersdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/userData/getUserData/:userId
usersAPI.get("/getUserData/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userdata = await usersModel.findOne({
      UserID: userId,
    });
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(userdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/userData/updateUserData/:userId

usersAPI.put("/updateUserData/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedetails = req.body;

  const updateUserData = async (userId, updatedetails) => {
    try {
      // Find the community document by ID
      const user = await usersModel.findOne({ UserID: userId });

      if (user) {
        if (updatedetails.UserID !== undefined) {
          user.UserID = updatedetails.UserID;
        }

        if (updatedetails.CommunityID !== undefined) {
          user.CommunityID = updatedetails.CommunityID;
        }
        if (updatedetails.CommunityName !== undefined) {
          user.CommunityName = updatedetails.CommunityName;
        }
        if (updatedetails.ApartmentID !== undefined) {
          user.Apartment.ApartmentID = updatedetails.ApartmentID;
        }
        if (updatedetails.ApartmentName !== undefined) {
          user.Apartment.ApartmentName = updatedetails.ApartmentName;
        }
        if (updatedetails.UnitID !== undefined) {
          user.Apartment.Unit.UnitID = updatedetails.UnitID;
        }
        if (updatedetails.UnitNumber !== undefined) {
          user.Apartment.Unit.UnitNumber = updatedetails.UnitNumber;
        }
        if (updatedetails.UserName !== undefined) {
          user.Apartment.Unit.User.UserName = updatedetails.UserName;
        }
        if (updatedetails.UserEmail !== undefined) {
          user.Apartment.Unit.User.UserEmail = updatedetails.UserEmail;
        }
        if (updatedetails.UserPhone !== undefined) {
          user.Apartment.Unit.User.UserPhone = updatedetails.UserPhone;
        }
        if (updatedetails.UserAddress !== undefined) {
          user.Apartment.Unit.User.UserAddress = updatedetails.UserAddress;
        }

        const updateuser = await user.save();
        return updateuser;
      } else {
        return null; // User not found
      }
    } catch (error) {
      console.error(error);
      throw error; // Handle the error appropriately in your application
    }
  };

  const updateduser = await updateUserData(userId, updatedetails);
  if (updateduser) {
    res.json(updateduser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// http://localhost:3000/userData/deleteUserData/:userId
usersAPI.delete("/deleteUserData/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await usersModel.deleteOne({
      UserID: userId,
    });
    if (deletedUser.deletedCount === 1) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = usersAPI;
