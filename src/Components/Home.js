import React, { useState } from "react";
import Property from "./Property";
import PropertyDetails from "./PropertyDetails";
import Nav from "./Nav";
import Map from "./Map";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import Search from "./Search";

const Home = (props) => {
  const [currentPropState, setCurrentPropState] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Dummy data for test properties
  const properties = [
    {
      id: 1,
      name: "Property 1",
      address: "123 Main St",
      lat: 39.1721943,
      lng: -86.5099879,
    },
    // Los Angeles example is just to show that the map works with any location
    {
      id: 2,
      name: "Los Angeles",
      address: "LA",
      lat: 34.04394,
      lng: -118.22942,
    },
    {
      id: 3,
      name: "Property 3",
      address: "789 Oak St",
      lat: 39.17207,
      lng: -86.51219,
    },
    {
      id: 4,
      name: "Property 4",
      address: "123 Main St",
      lat: 39.174,
      lng: -86.5099879,
    },
    {
      id: 5,
      name: "SRSC",
      address: "456 Elm St",
      lat: 39.1735,
      lng: -86.51214,
    },
    {
      id: 6,
      name: "Eigenmann Hall",
      address: "789 Oak St",
      lat: 39.17101,
      lng: -86.50871,
    },
  ];

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
      return property.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  let searchResults = filterProperties();
  function MapComponent() {
    console.log("Selected Prop: " + selectedProperty);
    return (
      <Map
        latitude={selectedProperty.lat}
        longitude={selectedProperty.lng}
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
          className={`property-${property.id}`}
          id={property.id}
          onClick={() => changeProperty(property)}
        >
          <Property name={property.name} address={property.address} />
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

  return (
    <>
      <Helmet>
        <title>Home | StudentSmart Rentals</title>
      </Helmet>
      <div className="home_container">
        <Nav />
        <div className="home_layout">
          <div className="map-container" style={{ display: "none" }}>
            {ShowMap()}
          </div>
          <div className="p-4 box mt-3 text-center property_container">
            {selectedProperty === null && ( // Conditionally render the search when no property is selected
              <Search
                id="search"
                searchQuery={searchQuery}
                handleSearchInputChange={handleSearchInputChange}
                searchResults={searchResults}
                handleKeyPress={handleKeyPress}
              />
            )}
            {searchQuery && (
              <div className="search-results">
                {searchResults.map((property) => (
                  <div
                    key={property.id}
                    className={`property-${property.id}`}
                    id={property.id}
                    onClick={() => changeProperty(property)}
                  >
                    <Property name={property.name} address={property.address} />
                  </div>
                ))}
              </div>
            )}
            <div style={{ height: "100px" }}></div>
            {ShowProperty()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
