import React from 'react';
import Property from './Property';
import axios from 'axios';
import { useEffect } from 'react';
import "../css/Property.css";

const PropertyDetails = ({ property }) => {

  const RandomBusColor = () => {
    const colors = [
      "#ff707a", "#fcd97e", "#6ebf8a", "#68a2c4", "#67b8b3", "#6c92c5", "#b686be",
      "#ff7f87", "#fde185", "#82c196", "#7ea8cf", "#7dbfbf", "#8099cf", "#c899c6",
      "#ff8f96", "#fee38b", "#92d4a1", "#8bb6d1", "#8fcaca", "#94a9d1", "#d3a5cf",
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    console.log("Random color picked: ", randomColor);
    return randomColor;
  }

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

  /* 
  BusesToCollege: Array(3) [ 6, 9, 1 ]
  CommApartments: Object { ApartmentID: "A101", AptName: "MeadowPark", _id: "6539a88c4e1221a26d04da41", … }
  CommCity: "Bloomington"
  CommDistanceFromCollege: 2.5
  CommLocation: Object { latitude: 1.12, longitude: 3.24 }
  CommStAddress: "123 Main St"
  CommunityFeatures: Array [ "Swimming Pool and Sundeck", "Dogs and Cats are Welcome" ]
  CommunityID: "1"
  CommunityName: "Sample Community"
  CommunityRules: Array [ "Rule1", "Rule2" ]
  State: "Sample State"
  Zipcode: "12345"
  */

  return (
    <div className="property-details">
      <h2>Property Details</h2>
      <p><strong>Name:</strong> {property.CommunityName}</p>
      <p><strong>Address:</strong> {property.CommStAddress}</p>
      <p><strong>City:</strong> {property.CommCity}</p>
      <p><strong>State:</strong> {property.State}</p>
      <p><strong>Zipcode:</strong> {property.Zipcode}</p>
      <span className='buses'><strong>Buses to Campus: </strong> {property.BusesToCollege.map((bus) => (
        <div className='bus' style={{backgroundColor: RandomBusColor()}}>
          <p>{bus}</p>
        </div>
      ))} </span>
      <span className='features'><strong>Features: </strong> {property.CommunityFeatures.map((rule) => (
          <p className='feature'>{rule}</p>
      ))} </span>
      <span className='rules'><strong>Rules: </strong> {property.CommunityRules.map((rule) => (
          <p className='rule'>{rule}</p>
      ))} </span>

    </div>
  );
}

export default PropertyDetails;