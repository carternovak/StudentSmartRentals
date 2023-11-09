import React from 'react';
import Property from './Property';
import axios from 'axios';
import { useEffect } from 'react';

const PropertyDetails = ({ property }) => {

      // backend integration starts here
  // we will get the community data requested by user when he clicks on a paticular id just get the id from user to show up the card details of particular community
  
  const fetchOneCommunityData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/communityData/getAllCommunityData/1");
      // Handle the data received from the API
      console.log(data);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching community data:", error);
    }
  };
  
  useEffect(() => {
    fetchOneCommunityData();
  }, []); // Empty dependency array means this effect runs once after the initial render
  

// backend integration ends here


  if (!property) {
    return null;
  }

  return (
    <div className="property-details">
      <h2>Property Details</h2>
      <p><strong>Name:</strong> {property.name}</p>
      <p><strong>Address:</strong> {property.address}</p>
    </div>
  );
}

export default PropertyDetails;