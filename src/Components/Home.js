import React, { useEffect, useState } from "react";
import Property from "./Property";
import PropertyDetails from "./PropertyDetails";
import Nav from "./Nav";
import Map from "./Map";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import Search from "./Search";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Apartments from "./Apartments";

const Home = (props) => {
  const [currentPropState, setCurrentPropState] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Dummy data for test properties
  // const properties = [
  //   {
  //     id: 1,
  //     name: "Property 1",
  //     address: "123 Main St",
  //     lat: 39.1721943,
  //     lng: -86.5099879,
  //   },
  //   // Los Angeles example is just to show that the map works with any location
  //   {
  //     id: 2,
  //     name: "Los Angeles",
  //     address: "LA",
  //     lat: 34.04394,
  //     lng: -118.22942,
  //   },
  //   {
  //     id: 3,
  //     name: "Property 3",
  //     address: "789 Oak St",
  //     lat: 39.17207,
  //     lng: -86.51219,
  //   },
  //   {
  //     id: 4,
  //     name: "Property 4",
  //     address: "123 Main St",
  //     lat: 39.174,
  //     lng: -86.5099879,
  //   },
  //   {
  //     id: 5,
  //     name: "SRSC",
  //     address: "456 Elm St",
  //     lat: 39.1735,
  //     lng: -86.51214,
  //   },
  //   {
  //     id: 6,
  //     name: "Eigenmann Hall",
  //     address: "789 Oak St",
  //     lat: 39.17101,
  //     lng: -86.50871,
  //   },
  // ];

  const [properties, setProperties] = useState([]);

  function TogglePropState() {
    setCurrentPropState(!currentPropState);
  }

  // All search related functions
  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
  }
  function handleKeyPress() {
    if (searchResults.length > 0) searchResults = filterProperties();
  }

  function filterProperties() {
    return properties.filter((property) => {
      return property.CommunityName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  let searchResults = filterProperties();
  function MapComponent() {
    console.log("Selected Prop: " + selectedProperty);
    return (
      <Map
        latitude={selectedProperty.CommLocation.latitude}
        longitude={selectedProperty.CommLocation.longitude}
        selectedProperty={selectedProperty}
        zoom={18}
        properties={properties}
      />
    );
  }

  function ShowMap() {
    if (selectedProperty !== null) {
      return <MapComponent />;
    } else {
      return null;
    }
  }

  function ShowProperty() {
    if (currentPropState === false) {
      return properties.map((property) => (
        <div
          key={property.id}
          className={`property-box ${property.CommunityID}`}
          id={property.CommunityID}
          onClick={() => changeProperty(property)}
        >
          <Property name={property.CommunityName} address={property.CommStAddress} />
        </div>
      ));
    } else {
      if (selectedProperty !== null) {
        return (
          <div
            className={`property selected`}
            onClick={() => changeProperty(null)}
          >
            <PropertyDetails property={selectedProperty} />
          </div>
        );
      } else {
        return null;
      }
    }
  }

  const changeProperty = (property) => {
    if (selectedProperty === null) {
      // update selectedProperty
      setSelectedProperty(property);

      // show map
      document.querySelector(".map-container").style.display = "inline";
      setSearchQuery("");
    } else {
      // hide map
      document.querySelector(".map-container").style.display = "none";

      // Clear selectedProperty
      setSelectedProperty(null);
    }

    // Toggles between showing list of properties or a single property
    TogglePropState();
  };

  // backend integration starts here
  // we will get ll the community data just iterate to show up the card details

  const fetchAllCommunityData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/communityData/getAllCommunityData");
      // Handle the data received from the API
      console.log(data);
      setProperties(data);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching community data:", error);
    }
  };

  useEffect(() => {
    fetchAllCommunityData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  // backend integration ends here

  return (
    <>
      <Helmet>
        <title>Home | StudentSmart Rentals</title>
      </Helmet>
      <div className="home_container">
        <Nav />
        <div className="home_layout">
          <div className="details-container">
            <div className="map-container" style={{ display: "none" }}>
              {ShowMap()}
            </div>
            <div className={`box text-center property_container ${selectedProperty ? "selected-container" : ""}`}>
              {!selectedProperty && ( // Conditionally render the search when no property is selected
                <div style={{ marginBottom: "100px", width: "20%" }}>
                  <Search
                    id="search"
                    searchQuery={searchQuery}
                    handleSearchInputChange={handleSearchInputChange}
                    searchResults={searchResults}
                    handleKeyPress={handleKeyPress}
                  />
                </div>
              )}
              {searchQuery && (
                <div className="search-results">
                  {searchResults.map((property) => (
                    <div
                      key={property.CommunityID}
                      className={`property-box ${property.CommunityID}`}
                      id={property.CommunityID}
                      onClick={() => changeProperty(property)}
                    >
                      <Property name={property.CommunityName} address={property.CommStAddress} />
                    </div>
                  ))}
                </div>
              )}
              {ShowProperty()}
            </div>
          </div>
          {selectedProperty && (
            <Apartments selectedProperty={selectedProperty}/>
          )}
        </div>
        <footer className="footer">
          <p>2023 StudentSmart Rentals</p>
        </footer>
      </div>
    </>
  );
};

export default Home;
