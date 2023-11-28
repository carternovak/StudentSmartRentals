const exp = require("express");
const MaintenanceTicket = require("../Schemas/maintenanceSchema");
const MaintenanceTicketModel = require("../Schemas/maintenanceSchema");
const maintenanceAPI = exp.Router();

// http://localhost:3000/maintenanceData/postMaintenanceData

maintenanceAPI.post("/postMaintenanceData", async (req, res) => {
  const maintenanceData = new MaintenanceTicketModel({
    communityID: req.body.communityID,
    apartmentID: req.body.apartmentID,
    unitID: req.body.unitID,
    ownerID: req.body.ownerID,
    userID: req.body.userID,
    unitNumber: req.body.unitNumber,
    ticketID: req.body.ticketID,
    issueType: req.body.issueType,
    description: req.body.description,
    isResolved: req.body.isResolved,
    isApproved: req.body.isApproved,
    createdAt: req.body.createdAt,
    closedAt: req.body.closedAt,
  });

  const val = await maintenanceData.save();
  res.json(val);
});

// http://localhost:3000/maintenanceData/getMaintenanceData
maintenanceAPI.get("/getMaintenanceData", async (req, res) => {
  try {
    const maintenancedata = await MaintenanceTicketModel.find();
    if (!maintenancedata) {
      return res.status(404).json({ error: "No Tickets found" });
    }
    res.json(maintenancedata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/maintenanceData/getticketData/:ticketId
maintenanceAPI.get("/getticketData/:ticketId", async (req, res) => {
  const ticketid = req.params.ticketId;

  try {
    const ticketdata = await MaintenanceTicketModel.findOne({
      ticketID: ticketid,
    });
    if (!ticketdata) {
      return res.status(404).json({ error: "ticket not found" });
    }
    res.json(ticketdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// http://localhost:3000/maintenanceData/updateMaintenanceData/:ticketId

maintenanceAPI.put("/updateMaintenanceData/:ticketId", async (req, res) => {
  const ticketid = req.params.ticketId;
  const updatedetails = req.body;

  const updateTicketData = async (ticketid, updatedetails) => {
    try {
      // Find the community document by ID
      const ticket = await MaintenanceTicketModel.findOne({
        ticketID: ticketid,
      });

      if (ticket) {
        if (updatedetails.communityID !== undefined) {
          ticket.communityID = updatedetails.communityID;
        }

        if (updatedetails.apartmentID !== undefined) {
          ticket.apartmentID = updatedetails.apartmentID;
        }
        if (updatedetails.unitID !== undefined) {
          ticket.unitID = updatedetails.unitID;
        }
        if (updatedetails.ownerID !== undefined) {
          ticket.ownerID = updatedetails.ownerID;
        }
        if (updatedetails.userID !== undefined) {
          ticket.userID = updatedetails.userID;
        }
        if (updatedetails.unitNumber !== undefined) {
          ticket.unitNumber = updatedetails.unitNumber;
        }
        if (updatedetails.ticketID !== undefined) {
          ticket.ticketID = updatedetails.ticketID;
        }
        if (updatedetails.issueType !== undefined) {
          ticket.issueType = updatedetails.issueType;
        }
        if (updatedetails.description !== undefined) {
          ticket.description = updatedetails.description;
        }
        if (updatedetails.isResolved !== undefined) {
          ticket.isResolved = updatedetails.isResolved;
        }
        if (updatedetails.isApproved !== undefined) {
          ticket.isApproved = updatedetails.isApproved;
        }
        if (updatedetails.createdAt !== undefined) {
          ticket.createdAt = new Date(updatedetails.createdAt);
        }

        if (updatedetails.closedAt !== undefined) {
          ticket.closedAt = new Date(updatedetails.closedAt);
        }
        
        const updateticket = await ticket.save();
        return updateticket;
      } else {
        return null; // Ticket not found
      }
    } catch (error) {
      console.error(error);
      throw error; // Handle the error appropriately in your application
    }
  };

  const updatedticket = await updateTicketData(ticketid, updatedetails);
  if (updatedticket) {
    res.json(updatedticket);
  } else {
    res.status(404).json({ error: "Ticket not found" });
  }
});

// http://localhost:3000/maintenanceData/deleteMaintenanceData/:ticketId
maintenanceAPI.delete("/deleteMaintenanceData/:ticketId", async (req, res) => {
  const ticketid = req.params.ticketId;
  try {
    const deletedTicket = await MaintenanceTicketModel.deleteOne({
      ticketID: ticketid,
    });
    if (deletedTicket.deletedCount === 1) {
      res.json({ message: "Ticket deleted successfully" });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = maintenanceAPI;
