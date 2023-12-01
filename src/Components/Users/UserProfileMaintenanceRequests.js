import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserProfileCard,
  UserProfileTitle,
  UserProfileInfoContainer,
  UserProfileInfoLabel,
  UserProfileInfoValue,
  UserProfileButton,
  UserProfileList,
  UserProfileListItem,
  UserProfileInput,
} from "./UserProfilePageContainer";

const UserProfileMaintenanceRequests = ({ user }) => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isAddingTicket, setIsAddingTicket] = useState(false);

  useEffect(() => {
    const fetchAllMaintainanceTickets = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/maintenanceData/getMaintenanceData"
        );
        // Handle the data received from the API
        console.log(data);
        setMaintenanceData(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching community data:", error);
      }
    };
    fetchAllMaintainanceTickets();
  }, [user.uid]);

  const [newTicket, setNewTicket] = useState({
    issueType: "",
    description: "",
  });

  const handleTicketInputChange = (event, field) => {
    setNewTicket({
      ...newTicket,
      [field]: event.target.value,
    });
  };
  const postNewTicket = async () => {
    try {
      const newMaintenanceRequest = {
        apartmentID: maintenanceData[0].apartmentID,
        closedAt: null,
        communityID: maintenanceData[0].communityID,
        createdAt: new Date(),
        description: newTicket.description,
        isResolved: false,
        issueType: newTicket.issueType,
        ownerID: maintenanceData[0].ownerID,
        ticketID: maintenanceData[maintenanceData.length - 1].ticketID + "1",
        unitID: maintenanceData[0].unitID,
        unitNumber: maintenanceData[0].unitNumber,
        userID: maintenanceData[0].userID,
      };

      const response = await fetch(
        "http://localhost:5000/maintenanceData/postMaintenanceData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMaintenanceRequest),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      // Update the user's maintenance requests with the new ticket
      // TODO: Need to change this logic as userprofile no longer has maintenanceRequest related attributes. Need to fetch from backend
      setMaintenanceData({
        ...maintenanceData,
        newMaintenanceRequest,
      });

      // Clear the form and exit "adding ticket" mode
      setNewTicket({
        issueType: "",
        description: "",
      });
      setIsAddingTicket(false);
    } catch (error) {
      // Handle errors here
      console.error("Error submitting form newMaintenanceRequest:", error);
    }
  };
  return (
    <UserProfileCard>
      <UserProfileTitle>Maintenance Requests</UserProfileTitle>
      <UserProfileList>
        {maintenanceData.map((maintenanceRequest, index) => (
          <UserProfileListItem
            key={index}
            style={{
              background:
                maintenanceRequest.isResolved === false
                  ? "#e6f7ff"
                  : maintenanceRequest.isResolved === true
                  ? "#c8e6c9"
                  : "white",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div>
              <div>
                <UserProfileInfoLabel>Issue Type:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {maintenanceRequest.issueType}
                </UserProfileInfoValue>
              </div>
              <div>
                <UserProfileInfoLabel>Description:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {maintenanceRequest.description}
                </UserProfileInfoValue>
              </div>
              <div>
                <UserProfileInfoLabel>Status:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {maintenanceRequest.isResolved === false
                    ? "Pending"
                    : "Completed"}
                </UserProfileInfoValue>
              </div>
            </div>
          </UserProfileListItem>
        ))}
      </UserProfileList>
      {isAddingTicket ? (
        <div>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Heading:</UserProfileInfoLabel>
            <UserProfileInput
              type="text"
              value={newTicket.heading}
              onChange={(e) => handleTicketInputChange(e, "heading")}
            />
          </UserProfileInfoContainer>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Description:</UserProfileInfoLabel>
            <UserProfileInput
              type="text"
              value={newTicket.description}
              onChange={(e) => handleTicketInputChange(e, "description")}
            />
          </UserProfileInfoContainer>
          <UserProfileButton onClick={postNewTicket}>
            Post Ticket
          </UserProfileButton>
        </div>
      ) : (
        <UserProfileButton onClick={() => setIsAddingTicket(true)}>
          Add Ticket
        </UserProfileButton>
      )}
    </UserProfileCard>
  );
};

export default UserProfileMaintenanceRequests;