import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Nav from "../Nav";
import "../../css/Home.css";


const dummyUserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    propertyId: '1234567890',
    password:'1234',
    maintenanceRequests: [
      {
        heading: 'leaky faucet',
        description: 'Fix the leaky faucet in the kitchen sink.',
        status: 'Pending',
        createdAt: new Date(),
      },
      {
        heading: 'broken lightbulb',
        description: 'Replace the broken lightbulb in the living room.',
        status: 'Completed',
        createdAt: new Date(),
      },
    ],
    lease: {
      startDate: new Date('2023-10-01'),
      endDate: new Date('2024-09-30'),
      rentAmount: 1500,
    },
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    dateOfBirth: '1990-01-01',
  };

  const UserProfilePageContainer = styled.div`
  position: relative;
  top: 2%; /* Adjust this value to set the desired margin from the top */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
`;

const UserProfileNavigationBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 20px;
  border-bottom: 1px solid #ccc;
`;

const UserProfileNavigationLink = styled(Link)`
  text-decoration: none;
  color: #333;
  margin: 0 20px;
  font-size: 18px;
  &:hover {
    color: #ff0000;
  }
`;

const UserProfileCard = styled.div`
  width: 500px;
  margin: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserProfileTitle = styled.h1`
  text-align: center;
  color: #333;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
`;

const UserProfileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const UserProfileInfoLabel = styled.label`
  font-weight: bold;
  color: #666;
  font-size: 16px;
  margin-bottom: 5px;
`;

const UserProfileInfoValue = styled.div`
  font-size: 18px;
  color: #333;
`;

const UserProfileButton = styled.button`
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #cc0000;
  }
`;
const UserProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  color: #000000;
`;

const UserProfileInput = styled.input`
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  font-size: 16px;
`;

const UserProfileList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserProfileListItem = styled.li`
  margin-bottom: 10px;
  color: #000000;
`;

const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState(dummyUserProfile);
  const [isEditing, setIsEditing,isCreatingTicket ] = useState(false);
  const [activePage, setActivePage] = useState('user-info');
  const [newTicket, setNewTicket] = useState({
    heading: '',
    description: '',
  });
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const handlePasswordChange = () => {
    if (userProfile.password === currentPassword) {
      // Update the user's password with the new password
      setUserProfile({
        ...userProfile,
        password: newPassword,
      });

      // Clear the form and exit "editing password" mode
      setNewPassword('');
      setCurrentPassword('');
      setIsEditingPassword(false);
      setPasswordMatch(true);
      alert("password changed")
    } else {
      // Handle incorrect current password (e.g., display an error message)
      setPasswordMatch(false);
    }
  };
  const handleTicketInputChange = (event, field) => {
    setNewTicket({
      ...newTicket,
      [field]: event.target.value,
    });
  };

  const postNewTicket = () => {
    // Validate the input, e.g., ensure the fields are not empty
  
    // Create a new maintenance ticket object
    const newMaintenanceRequest = {
        heading: newTicket.heading,
      description: newTicket.description,
      status: 'Pending',
      createdAt: new Date(),
    };
  
    // Update the user's maintenance requests with the new ticket
    setUserProfile({
      ...userProfile,
      maintenanceRequests: [...userProfile.maintenanceRequests, newMaintenanceRequest],
    });
  
    // Clear the form and exit "adding ticket" mode
    setNewTicket({
      heading: '',
      description: '',
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
    setUserProfile({
      ...userProfile,
      [field]: event.target.value,
    });
  };

  const saveChanges = () => {
    // Regular expressions for email and phone number validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

  const isEmailValid = emailRegex.test(userProfile.email);
  const isPhoneNumberValid = phoneRegex.test(userProfile.phoneNumber);

  if (!isEmailValid) {
    // Handle invalid email (e.g., display an error message)
    alert('Invalid email');
    return;
  }

  if (!isPhoneNumberValid) {
    // Handle invalid phone number (e.g., display an error message)
    alert('Invalid phone number');
    return;
  }

  // If both email and phone number are valid, save the changes
  // You can make a server request here to save the changes
  setIsEditing(false);
  };

  return (
    <div className="home_container">
        <Nav />
    <UserProfilePageContainer>
      <UserProfileNavigationBar>
        <UserProfileNavigationLink to="/profile" onClick={() => handlePageChange('user-info')}>User Info</UserProfileNavigationLink>
        <UserProfileNavigationLink to="/profile" onClick={() => handlePageChange('lease-info')}>Lease Info</UserProfileNavigationLink>
        <UserProfileNavigationLink to="/profile" onClick={() => handlePageChange('maintenance-requests')}>Maintenance Requests</UserProfileNavigationLink>
      </UserProfileNavigationBar>

      {activePage === 'user-info' && (
        <UserProfileCard>
          <UserProfileTitle>User Profile</UserProfileTitle>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Name:</UserProfileInfoLabel>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => handleInputChange(e, 'name')}
              />
            ) : (
              <UserProfileInfoValue>{userProfile.name}</UserProfileInfoValue>
            )}
          </UserProfileInfoContainer>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Email:</UserProfileInfoLabel>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
            ) : (
              <UserProfileInfoValue>{userProfile.email}</UserProfileInfoValue>
            )}
          </UserProfileInfoContainer>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Phone Number:</UserProfileInfoLabel>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.phoneNumber}
                onChange={(e) => handleInputChange(e, 'phoneNumber')}
              />
            ) : (
              <UserProfileInfoValue>{userProfile.phoneNumber}</UserProfileInfoValue>
            )}
          </UserProfileInfoContainer>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Address:</UserProfileInfoLabel>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.address}
                onChange={(e) => handleInputChange(e, 'address')}
              />
            ) : (
              <UserProfileInfoValue>{userProfile.address}</UserProfileInfoValue>
            )}
          </UserProfileInfoContainer>
          <UserProfileInfoContainer>
            <UserProfileInfoLabel>Date of Birth:</UserProfileInfoLabel>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.dateOfBirth}
                onChange={(e) => handleInputChange(e, 'dateOfBirth')}
              />
            ) : (
              <UserProfileInfoValue>{userProfile.dateOfBirth}</UserProfileInfoValue>
            )}
          </UserProfileInfoContainer>
          {isEditing ? (
            <UserProfileButton onClick={saveChanges}>Save Changes</UserProfileButton>
          ) : (
            <div>
                <UserProfileButton onClick={handleEditToggle}>Edit</UserProfileButton>
                <UserProfileButton onClick={() => setIsEditingPassword(!isEditingPassword)}>Edit Password</UserProfileButton>
            </div>
          )}
          
        </UserProfileCard>
      )}

{activePage === 'maintenance-requests' && (
  <UserProfileCard>
    <UserProfileTitle>Maintenance Requests</UserProfileTitle>
    <UserProfileList>
      {userProfile.maintenanceRequests.map((maintenanceRequest, index) => (
        <UserProfileListItem key={index} style={{ background: maintenanceRequest.status === 'Pending' ? '#e6f7ff' : (maintenanceRequest.status === 'Completed' ? '#c8e6c9' : 'white'), border: '1px solid #ccc', padding: '10px' }}>
          <div>
            <div>
              <UserProfileInfoLabel>Heading:</UserProfileInfoLabel>
              <UserProfileInfoValue>{maintenanceRequest.heading}</UserProfileInfoValue>
            </div>
            <div>
              <UserProfileInfoLabel>Description:</UserProfileInfoLabel>
              <UserProfileInfoValue>{maintenanceRequest.description}</UserProfileInfoValue>
            </div>
            <div>
              <UserProfileInfoLabel>Status:</UserProfileInfoLabel>
              <UserProfileInfoValue>{maintenanceRequest.status}</UserProfileInfoValue>
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
            onChange={(e) => handleTicketInputChange(e, 'heading')}
          />
        </UserProfileInfoContainer>
        <UserProfileInfoContainer>
          <UserProfileInfoLabel>Description:</UserProfileInfoLabel>
          <UserProfileInput
            type="text"
            value={newTicket.description}
            onChange={(e) => handleTicketInputChange(e, 'description')}
          />
        </UserProfileInfoContainer>
        <UserProfileButton onClick={postNewTicket}>Post Ticket</UserProfileButton>
      </div>
    ) : (
      <UserProfileButton onClick={() => setIsAddingTicket(true)}>Add Ticket</UserProfileButton>
    )}
  </UserProfileCard>
)}

      {activePage === 'lease-info' && (
        <UserProfileCard>
          <UserProfileTitle>Lease</UserProfileTitle>
          <UserProfileList>
            <UserProfileListItem>
              Start date: {userProfile.lease.startDate.toLocaleDateString()}
            </UserProfileListItem>
            <UserProfileListItem>
              End date: {userProfile.lease.endDate.toLocaleDateString()}
            </UserProfileListItem>
            <UserProfileListItem>
              Rent amount: ${userProfile.lease.rentAmount}
            </UserProfileListItem>
          </UserProfileList>
        </UserProfileCard>
      )}
      {isEditingPassword && (
          <UserProfileCard>
            <UserProfileTitle>Edit Password</UserProfileTitle>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>Current Password:</UserProfileInfoLabel>
              <UserProfileInput
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </UserProfileInfoContainer>
            <UserProfileInfoContainer>
              <UserProfileInfoLabel>New Password:</UserProfileInfoLabel>
              <UserProfileInput
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </UserProfileInfoContainer>
            {!passwordMatch && (
              <div style={{ color: 'red' }}>Incorrect current password.</div>
            )}
            <UserProfileButton onClick={handlePasswordChange}>Save Password</UserProfileButton>
          </UserProfileCard>
        )}
    </UserProfilePageContainer>
</div>
  );
};

export default UserProfilePage;


