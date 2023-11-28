import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../Nav";
import "../../css/Home.css";
import { useUserAuth } from "../../context/UserAuthContext";
import { getDoc, setDoc } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  UserProfilePageContainer,
  UserProfileNavigationBar,
  UserProfileNavigationLink,
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
import PropertyDetails from "../PropertyDetails";
let dummyUserProfile = {
  displayName: "My",
  email: "My",
  phone: "",
  propertyId: "1234567890",
  password: "1234",
  maintenanceRequests: [
    {
      apartmentID:"1P"
      ,closedAt: "2023-10-30T08:00:00.000Z"
      ,communityID: "1"
      ,createdAt: "2023-10-30T08:00:00.000Z"
      ,description: "Leak in the bathroom"
      ,isResolved: false
      ,issueType: "Plumbing"
      ,ownerID: "owner123"
      ,ticketID: "ticket789"
      ,unitID: "1P3"
      ,unitNumber: "3"
      ,userID: "1U"
    },
    {
      apartmentID:"1P"
      ,closedAt: "2023-10-30T08:00:00.000Z"
      ,communityID: "1"
      ,createdAt: "2023-10-30T08:00:00.000Z"
      ,description: "Leak in the bathroom"
      ,isResolved: true
      ,issueType: "Plumbing"
      ,ownerID: "owner123"
      ,ticketID: "ticket789"
      ,unitID: "1P3"
      ,unitNumber: "3"
      ,userID: "1U"
    },
  ],
  lease: {
    startDate: new Date("2023-10-01"),
    endDate: new Date("2024-09-30"),
    rentAmount: 1500,
  },
  address: "123 Main St",
  city: "Anytown",
  state: "CA",
  postalCode: "12345",
  dob: "1990-01-01",
};

const UserProfilePage = () => {
  const { user } = useUserAuth();

  dummyUserProfile.displayName = user.displayName;
  dummyUserProfile.dob = user.dob;
  dummyUserProfile.email = user.email;
  dummyUserProfile.phone = user.phone;
  dummyUserProfile.address = user.address;
  const [userProfile, setUserProfile] = useState([]);
  const [isEditing, setIsEditing, isCreatingTicket] = useState(false);
  const [activePage, setActivePage] = useState("user-info");
  const [editedFields, setEditedFields] = useState({});
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [userPropertyDetails, setUserPropertDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docSnapshot = await getDoc(doc(db, "users", user.uid));
        if (docSnapshot.exists()) {
          const usrData = docSnapshot.data();
          setUserProfile(usrData);
        } else {
          console.log("Document doesn't exist");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
    const fetchUserPropertyDetails= async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/userData/getUserData/1U");
        // Handle the data received from the API
        console.log(data);
        setUserData(data)
      } catch (error) {
        // Handle errors here
        console.error("Error fetching user data:", error);
      }
      try {
        const { data } = await axios.get("http://localhost:5000/communityData/getAllCommunityData/"+ userData.CommunityID);
        // Handle the data received from the API
        console.log(data);
        setUserPropertDetails(data)
      } catch (error) {
        // Handle errors here
        console.error("Error fetching property data:", error);
      }
    };
    const fetchAllMaintainanceTickets = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/maintenanceData/getMaintenanceData");
        // Handle the data received from the API
        console.log(data);
        setMaintenanceData(data)
      } catch (error) {
        // Handle errors here
        console.error("Error fetching community data:", error);
      }
    }
    fetchUserProfile();
    fetchUserPropertyDetails();
    fetchAllMaintainanceTickets();

  }, [user.uid]);

  const [newTicket, setNewTicket] = useState({
    issueType: "",
    description: "",
  });
  const [isAddingTicket, setIsAddingTicket] = useState(false);

  const handleTicketInputChange = (event, field) => {
    setNewTicket({
      ...newTicket,
      [field]: event.target.value,
    });
  };

  const postNewTicket= async () =>  {
    try {
      const newMaintenanceRequest = {
        apartmentID: maintenanceData[0].apartmentID
        ,closedAt: null
        ,communityID: maintenanceData[0].communityID
        ,createdAt: new Date()
        ,description: newTicket.description
        ,isResolved: false
        ,issueType: newTicket.issueType
        ,ownerID: maintenanceData[0].ownerID
        ,ticketID: maintenanceData[maintenanceData.length -1].ticketID +'1'
        ,unitID: maintenanceData[0].unitID
        ,unitNumber:  maintenanceData[0].unitNumber
        ,userID:  maintenanceData[0].userID
      };

      const response = await fetch('http://localhost:5000/maintenanceData/postMaintenanceData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMaintenanceRequest)
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const result = await response.json();
        console.log(result);
        // Update the user's maintenance requests with the new ticket
        // TODO: Need to change this logic as userprofile no longer has maintenanceRequest related attributes. Need to fetch from backend
        setMaintenanceData({
          ...maintenanceData,
          newMaintenanceRequest
        })

        // Clear the form and exit "adding ticket" mode
        setNewTicket({
          issueType: "",
          description: "",
        });
        setIsAddingTicket(false);
    } catch (error) {
      // Handle errors here
      console.error('Error submitting form newMaintenanceRequest:', error);
    }
  };
  
  const handlePageChange = (page) => {
    setIsEditing(false); // Close editing when switching pages
    setActivePage(page);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (event, field) => {
    setEditedFields({
      ...editedFields,
      [field]: event.target.value,
    });
    setUserProfile({
      ...userProfile,
      [field]: event.target.value,
    });
  };

  const saveChanges = async () => {
    // Regular expressions for email and phone number validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    const isEmailValid = emailRegex.test(userProfile.email);
    const isPhoneNumberValid = phoneRegex.test(userProfile.phone);

    if (!isEmailValid) {
      // Handle invalid email (e.g., display an error message)
      alert("Invalid email");
      return;
    }

    if (!isPhoneNumberValid) {
      // Handle invalid phone number (e.g., display an error message)
      alert("Invalid phone number");
      return;
    }

    const updatedData = {
      ...editedFields,
    };

    await updateDoc(doc(db, "users", user.uid), updatedData)
      .then(() => {
        //Successful
      })
      .catch((error) => {
        console.error("Error updating Firestore document:", error);
      });

    // If both email and phone number are valid, save the changes
    // You can make a server request here to save the changes
    setIsEditing(false);
  };

  return (
    <div className="home_container">
      <Nav />
      <UserProfilePageContainer>
        <UserProfileNavigationBar>
          <UserProfileNavigationLink
            to="/profile"
            onClick={() => handlePageChange("user-info")}
          >
            User Info
          </UserProfileNavigationLink>
          <UserProfileNavigationLink
            to="/profile"
            onClick={() => handlePageChange("lease-info")}
          >
            Lease Info
          </UserProfileNavigationLink>
          <UserProfileNavigationLink
            to="/profile"
            onClick={() => handlePageChange("maintenance-requests")}
          >
            Maintenance Requests
          </UserProfileNavigationLink>
        </UserProfileNavigationBar>

        {activePage === "user-info" && (
          <UserProfileCard>
            <UserProfileTitle>User Profile</UserProfileTitle>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Name:</UserProfileInfoLabel>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.displayName}
                  onChange={(e) => handleInputChange(e, "displayName")}
                />
              ) : (
                <UserProfileInfoValue>
                  {userProfile.displayName}
                </UserProfileInfoValue>
              )}
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Email:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userProfile.email}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Phone Number:</UserProfileInfoLabel>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                />
              ) : (
                <UserProfileInfoValue>{userProfile.phone}</UserProfileInfoValue>
              )}
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Address:</UserProfileInfoLabel>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) => handleInputChange(e, "address")}
                />
              ) : (
                <UserProfileInfoValue>
                  {userProfile.address}
                </UserProfileInfoValue>
              )}
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Date of Birth:</UserProfileInfoLabel>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.dob}
                  onChange={(e) => handleInputChange(e, "dob")}
                />
              ) : (
                <UserProfileInfoValue>{userProfile.dob}</UserProfileInfoValue>
              )}
            </UserProfileInfoContainer>
            {isEditing ? (
              <UserProfileButton onClick={saveChanges}>
                Save Changes
              </UserProfileButton>
            ) : (
              <div>
                <UserProfileButton onClick={handleEditToggle}>
                  Edit
                </UserProfileButton>
              </div>
            )}
          </UserProfileCard>
        )}

        {activePage === "maintenance-requests" && (
          <UserProfileCard>
            <UserProfileTitle>Maintenance Requests</UserProfileTitle>
            <UserProfileList>
              {maintenanceData.map(
                (maintenanceRequest, index) => (
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
                        <UserProfileInfoLabel>
                          Description:
                        </UserProfileInfoLabel>
                        <UserProfileInfoValue>
                          {maintenanceRequest.description}
                        </UserProfileInfoValue>
                      </div>
                      <div>
                        <UserProfileInfoLabel>Status:</UserProfileInfoLabel>
                        <UserProfileInfoValue>
                          {maintenanceRequest.isResolved === false ? "Pending" : "Completed"}
                        </UserProfileInfoValue>
                      </div>
                    </div>
                  </UserProfileListItem>
                )
              )}
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
        )}

        {activePage === "lease-info" && (
          <UserProfileCard>
            <UserProfileTitle>Lease</UserProfileTitle>
            <UserProfileList>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Property Name:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userData.CommunityName}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Apartment Name:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userData.Apartment.ApartmentName}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Unit Number:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userData.Apartment.Unit.UnitNumber}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Address:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userPropertyDetails.CommStAddress} , {userPropertyDetails.CommCity}, {userPropertyDetails.State}, {userPropertyDetails.Zipcode} </UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Lease Start Date:</UserProfileInfoLabel>
              <UserProfileInfoValue>{dummyUserProfile.lease.startDate.toLocaleDateString()}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Lease End Date:</UserProfileInfoLabel>
              <UserProfileInfoValue>{dummyUserProfile.lease.endDate.toLocaleDateString()}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Rent:</UserProfileInfoLabel>
              <UserProfileInfoValue>{userPropertyDetails.CommApartments.AptUnits.UnitPrice}</UserProfileInfoValue>
            </UserProfileInfoContainer>
            </UserProfileList>
          </UserProfileCard>
        )}
      </UserProfilePageContainer>
    </div>
  );
};

export default UserProfilePage;
