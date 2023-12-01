import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Nav from "../Nav";
import "../../css/Home.css";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  UserProfilePageContainer,
  UserProfileCard,
  UserProfileTitle,
  UserProfileInfoContainer,
  UserProfileInfoLabel,
  UserProfileInfoValue,
  UserProfileButton,
  UserProfileList,
} from "./UserProfilePageContainer";
import UserNav from "./UserNav";
import UserProfileMaintenanceRequests from "./UserProfileMaintenanceRequests";
import UserProfileInfo from "./UserProfileInfo";
let dummyUserProfile = {
  displayName: "My",
  email: "My",
  phone: "",
  propertyId: "1234567890",
  password: "1234",
  maintenanceRequests: [
    {
      apartmentID: "1P",
      closedAt: "2023-10-30T08:00:00.000Z",
      communityID: "1",
      createdAt: "2023-10-30T08:00:00.000Z",
      description: "Leak in the bathroom",
      isResolved: false,
      issueType: "Plumbing",
      ownerID: "owner123",
      ticketID: "ticket789",
      unitID: "1P3",
      unitNumber: "3",
      userID: "1U",
    },
    {
      apartmentID: "1P",
      closedAt: "2023-10-30T08:00:00.000Z",
      communityID: "1",
      createdAt: "2023-10-30T08:00:00.000Z",
      description: "Leak in the bathroom",
      isResolved: true,
      issueType: "Plumbing",
      ownerID: "owner123",
      ticketID: "ticket789",
      unitID: "1P3",
      unitNumber: "3",
      userID: "1U",
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
  const [activePage, setActivePage] = useState("user-info");
  const [userPropertyDetails, setUserPropertDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showPayRentButton, setShowPayRentButton] = useState(false);
  useEffect(() => {
    const fetchUserPropertyDetails = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/userData/getUserData/1U"
        );
        // Handle the data received from the API
        console.log(data);
        setUserData(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching user data:", error);
      }
      try {
        const { data } = await axios.get(
          "http://localhost:5000/communityData/getAllCommunityData/" + userData.CommunityID
        );
        // Handle the data received from the API
        console.log(data);
        setUserPropertDetails(data);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching property data:", error);
      }
    };
    fetchUserPropertyDetails();
  }, [user.uid]);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const triggerHandlePayment = () => {
    setShowPayRentButton(!showPayRentButton);
  };
  const handlePayment = (price) => {
    fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unitPrice: price * 100,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        console.log(url);
        window.location = url;
      })
      .catch((e) => {
        console.error(e.message);
      });
  };

  return (
    <div className="home_container">
      <Helmet>
            <title>User Profile | StudentSmart Rentals</title>
      </Helmet>
      <Nav />

      <UserProfilePageContainer>
        <UserNav handlePageChange={handlePageChange} />
        {activePage === "user-info" && <UserProfileInfo user={user} />}
        {activePage === "maintenance-requests" && (
          <UserProfileMaintenanceRequests user={user} />
        )}

        {activePage === "lease-info" && (
          <UserProfileCard>
            <UserProfileTitle>Lease</UserProfileTitle>
            <UserProfileList>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Property Name:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {userData.CommunityName}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Apartment Name:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {userData.Apartment.ApartmentName}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Unit Number:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {userData.Apartment.Unit.UnitNumber}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Address:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {userPropertyDetails && (
                    <>
                      {userPropertyDetails.CommStAddress} ,{" "}
                      {userPropertyDetails.CommCity}, {userPropertyDetails.State},{" "}
                      {userPropertyDetails.Zipcode}{" "}
                    </>
                  )}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Lease Start Date:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {dummyUserProfile.lease.startDate.toLocaleDateString()}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Lease End Date:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {dummyUserProfile.lease.endDate.toLocaleDateString()}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                <UserProfileInfoLabel>Rent:</UserProfileInfoLabel>
                <UserProfileInfoValue>
                  {userPropertyDetails && (userPropertyDetails.CommApartments.AptUnits.UnitPrice)}
                </UserProfileInfoValue>
              </UserProfileInfoContainer>
              <UserProfileInfoContainer>
                {showPayRentButton ? (
                  <div>
                    <UserProfileButton
                      onClick={handlePayment(
                        userPropertyDetails.CommApartments.AptUnits.UnitPrice
                      )}
                    >
                      Pay Rent
                    </UserProfileButton>
                  </div>
                ) : (
                  <div>
                    <UserProfileButton onClick={triggerHandlePayment}>
                      Pay Rent
                    </UserProfileButton>
                  </div>
                )}
              </UserProfileInfoContainer>
            </UserProfileList>
          </UserProfileCard>
        )}
      </UserProfilePageContainer>
    </div>
  );
};

export default UserProfilePage;