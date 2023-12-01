import React, { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  UserProfileCard,
  UserProfileTitle,
  UserProfileInfoContainer,
  UserProfileInfoLabel,
  UserProfileInfoValue,
  UserProfileButton,
} from "./UserProfilePageContainer";
const UserProfileInfo = ({ user }) => {
  const [isEditingProfileInfo, setIsEditingProfileInfo] = useState(false);
  const [userProfile, setUserProfile] = useState([]);
  const [editedFields, setEditedFields] = useState({});

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
    fetchUserProfile();
  }, [user.uid]);
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
    setIsEditingProfileInfo(false);
  };
  const handleEditToggle = () => {
    setIsEditingProfileInfo(!isEditingProfileInfo);
  };

  return (
    <UserProfileCard>
      <UserProfileTitle>User Profile</UserProfileTitle>
      <UserProfileInfoContainer>
        <UserProfileInfoLabel>Name:</UserProfileInfoLabel>
        {isEditingProfileInfo ? (
          <input
            type="text"
            value={userProfile.displayName}
            onChange={(e) => handleInputChange(e, "displayName")}
          />
        ) : (
          <UserProfileInfoValue>{userProfile.displayName}</UserProfileInfoValue>
        )}
      </UserProfileInfoContainer>
      <UserProfileInfoContainer>
        <UserProfileInfoLabel>Email:</UserProfileInfoLabel>
        <UserProfileInfoValue>{userProfile.email}</UserProfileInfoValue>
      </UserProfileInfoContainer>
      <UserProfileInfoContainer>
        <UserProfileInfoLabel>Phone Number:</UserProfileInfoLabel>
        {isEditingProfileInfo ? (
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
        {isEditingProfileInfo ? (
          <input
            type="text"
            value={userProfile.address}
            onChange={(e) => handleInputChange(e, "address")}
          />
        ) : (
          <UserProfileInfoValue>{userProfile.address}</UserProfileInfoValue>
        )}
      </UserProfileInfoContainer>
      <UserProfileInfoContainer>
        <UserProfileInfoLabel>Date of Birth:</UserProfileInfoLabel>
        {isEditingProfileInfo ? (
          <input
            type="text"
            value={userProfile.dob}
            onChange={(e) => handleInputChange(e, "dob")}
          />
        ) : (
          <UserProfileInfoValue>{userProfile.dob}</UserProfileInfoValue>
        )}
      </UserProfileInfoContainer>
      {isEditingProfileInfo ? (
        <UserProfileButton onClick={saveChanges}>
          Save Changes
        </UserProfileButton>
      ) : (
        <div>
          <UserProfileButton onClick={handleEditToggle}>Edit</UserProfileButton>
        </div>
      )}
    </UserProfileCard>
  );
};
export default UserProfileInfo;
