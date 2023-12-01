import React, { useEffect, useState } from "react";
import Property from "./Property";
import PropertyDetails from "./PropertyDetails";
import Nav from "./Nav";
import Map from "./Map";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import Search from "./Search";
import axios from "axios";
import { Button } from "react-bootstrap";
import Apartments from "./Apartments";

const Home = (props) => {
  const [currentPropState, setCurrentPropState] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
          <a id="scroll" href="#home">
          <Property name={property.CommunityName} address={property.CommStAddress} />
          </a>
        </div>
      ));
    } else {
      if (selectedProperty !== null) {
        return (
          <div className={`property selected`}>
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

  // backend integration
  const fetchAllCommunityData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/communityData/getAllCommunityData");
      // Sort properties by name and store them in state array
      setProperties(data.sort((a, b) => a.CommunityName.localeCompare(b.CommunityName)));
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
        <div id="home" style={{position: "relative", top: "-70px"}}></div>
        <div className="home_layout">
          {selectedProperty && (
            <div className="back-button">
                <Button variant="danger" onClick={() => changeProperty(null)} style={{margin: "10px 30px"}}>&#8592; Back</Button>
            </div>
          )}
          <div className="details-container">
            <div className="map-container" style={{ display: "none" }}>
              {ShowMap()}
            </div>
            <div className={`box text-center property_container ${selectedProperty ? "selected-container" : ""}`}>
              {!selectedProperty && ( // Conditionally render the search when no property is selected
                <div style={{ margin: "60px auto 100px auto", width: "100%" }}>
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
