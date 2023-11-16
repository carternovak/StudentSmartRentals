const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for Maintenance Tickets
const maintenanceTicketSchema = new Schema({
  communityID: String,
  apartmentID: String,
  unitID: String,
  ownerID: String,
  userID: String,
  unitNumber: String,
  ticketID: String,
  issueType: String,
  description: String,
  isResolved: Boolean,
  isApproved: Boolean,
  createdAt: Date,
  closedAt: Date,
});

// Schema for the entire document (Maintenance Tickets Collection)

const MaintenanceTicketModel = mongoose.model(
  "MaintenanceTicket",
  maintenanceTicketSchema
);

module.exports = MaintenanceTicketModel;
