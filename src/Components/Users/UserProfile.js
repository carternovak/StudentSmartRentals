import React, { useState, useEffect } from "react";
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
let dummyUserProfile = {
  displayName: "My",
  email: "My",
  phone: "",
  propertyId: "1234567890",
  password: "1234",
  maintenanceRequests: [
    {
      heading: "leaky faucet",
      description: "Fix the leaky faucet in the kitchen sink.",
      status: "Pending",
      createdAt: new Date(),
    },
    {
      heading: "broken lightbulb",
      description: "Replace the broken lightbulb in the living room.",
      status: "Completed",
      createdAt: new Date(),
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
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docSnapshot = await getDoc(doc(db, "users", user.uid));
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserProfile(userData);
        } else {
          console.log("Document doesn't exist");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchUserProfile();
  }, [user.uid]);

  const [newTicket, setNewTicket] = useState({
    heading: "",
    description: "",
  });
  const [isAddingTicket, setIsAddingTicket] = useState(false);

  const handleTicketInputChange = (event, field) => {
    setNewTicket({
      ...newTicket,
      [field]: event.target.value,
    });
  };

  const postNewTicket = () => {
    const newMaintenanceRequest = {
      heading: newTicket.heading,
      description: newTicket.description,
      status: "Pending",
      createdAt: new Date(),
    };

    // Update the user's maintenance requests with the new ticket
    // TODO: Need to change this logic as userprofile no longer has maintenanceRequest related attributes. Need to fetch from backend
    setUserProfile({
      ...userProfile,
      maintenanceRequests: [
        ...dummyUserProfile.maintenanceRequests,
        newMaintenanceRequest,
      ],
    });

    // Clear the form and exit "adding ticket" mode
    setNewTicket({
      heading: "",
      description: "",
    });
    setIsAddingTicket(false);
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
              {dummyUserProfile.maintenanceRequests.map(
                (maintenanceRequest, index) => (
                  <UserProfileListItem
                    key={index}
                    style={{
                      background:
                        maintenanceRequest.status === "Pending"
                          ? "#e6f7ff"
                          : maintenanceRequest.status === "Completed"
                          ? "#c8e6c9"
                          : "white",
                      border: "1px solid #ccc",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <div>
                        <UserProfileInfoLabel>Heading:</UserProfileInfoLabel>
                        <UserProfileInfoValue>
                          {maintenanceRequest.heading}
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
                          {maintenanceRequest.status}
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
              <UserProfileListItem>
                Start date:{" "}
                {dummyUserProfile.lease.startDate.toLocaleDateString()}
              </UserProfileListItem>
              <UserProfileListItem>
                End date: {dummyUserProfile.lease.endDate.toLocaleDateString()}
              </UserProfileListItem>
              <UserProfileListItem>
                Rent amount: ${dummyUserProfile.lease.rentAmount}
              </UserProfileListItem>
            </UserProfileList>
          </UserProfileCard>
        )}
      </UserProfilePageContainer>
    </div>
  );
};

export default UserProfilePage;
