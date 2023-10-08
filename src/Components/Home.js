import React from "react";
import Property from "./Property";
import PropertyDetails from "./PropertyDetails";
import Nav from "./Nav";
import Map from './Map';
import "../css/Home.css";


const Home = (props) => {
  // Dummy data for test properties
  const properties = [
      { id: 1, name: "Property 1", address: "123 Main St" },
      { id: 2, name: "Property 2", address: "456 Elm St" },
      { id: 3, name: "Property 3", address: "789 Oak St" },
      { id: 4, name: "Property 4", address: "123 Main St" },
      { id: 5, name: "Property 5", address: "456 Elm St" },
      { id: 6, name: "Property 6", address: "789 Oak St" },
  ];
  var selectedProperty = null

  const handlePropertyClick = (property) => {
    if(selectedProperty === null) {
      // update selectedProperty
      selectedProperty = property;

      // show map
      document.querySelector('.map-container').style.display = 'block';

      // hide all other properties
      var allProperties = document.querySelectorAll('.property');
      allProperties.forEach(item => {
        if(item.parentElement.id != selectedProperty.id) {
          item.className = 'hidden';
        }
      });

      // add selected class to selected property
      var prop = document.getElementById(`${property.id}`);
      prop.className = `property-${property.id} selected`;
    } else {
      // hide map
      document.querySelector('.map-container').style.display = 'none';

      // show all other properties
      var allProperties = document.querySelectorAll('.hidden');
      allProperties.forEach(item => {
        if(item.parentElement.id != selectedProperty.id) {
          item.className = 'property';
        }
      });

      // reset the property's class and clear selectedProperty
      var prop = document.getElementById(`${property.id}`);
      prop.className = `property-${property.id}`;
      selectedProperty = null;
    }
  };

  return (
    <>
      <div className="home_container">
        <Nav />
        <div className="home_layout">
          <div className="map-container" style={{ display: "none" }}>
            <Map />
          </div>
          <div className="p-4 box mt-3 text-center property_container">
            {properties.map(property => (
              <div
                key={property.id}
                className={`property-${property.id}`}
                id={property.id}
                onClick={() => handlePropertyClick(property)}
              >
                <Property name={property.name} address={property.address} />
              </div>
            ))}
          </div>
        {selectedProperty && (
          <PropertyDetails property={selectedProperty} />
        )}
        {selectedProperty && (
            <div className="map">
              <Map />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
