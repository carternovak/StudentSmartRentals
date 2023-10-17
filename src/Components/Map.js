import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import MapMarker from "./MapMarker";
import MarkerIcon from "../images/MarkerIcon@0.25x.png";
import "../css/Map.css"


const Map = (props) => {
  // properties as in places to rent
  const [properties, setProperties] = useState(props.properties);
  const [userPosition, setUserPosition] = useState("");
  const [markers, setMarkers] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(props.selectedProperty);
  const [center, setCenter] = useState({
    lat: props.latitude,
    lng: props.longitude
  });
  
  const defaultProps = {
    center: {
      lat: 39.1721943,
      lng: -86.5099879
    },
    zoom: 14
  };
  
  const renderMarkers = (map, maps) => {
    var newMarkers = [];
    var marker = null
    properties.map((property) => (
      marker = new maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map,
        icon: MarkerIcon,
        title: `${property.name}`,
        label: {
          text: `${property.name}`,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'regular',
          className: 'marker-position',
      },
        }),
        console.log(marker.position.lat),
        newMarkers.push(marker)
      
    ));

    newMarkers.forEach(marker => {
      if(marker.title === selectedProperty.name) {
        marker.setLabel({
          text: `${marker.title}`,
          color: '#d90d32',
          fontSize: '12px',
          fontWeight: 'bold',
          className: 'marker-selected',
        })
      }
    });

    console.log(newMarkers);
    
    setMarkers(newMarkers);
  };

  // Get the user's location
  // Currently not being used
  // const getUserLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  //         setUserPosition(position);
  //       },
  //       (error) => {
  //         console.error("Error getting user's location:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by your browser.");
  //   }
  // }
  //
  // useEffect(() => {
  //   getUserLocation(); // Call this when the component mounts to get the user's location
  // }, []);

  

  console.log(props.selectedProperty.latitude);
  console.log("Lat: " + properties[0].lat);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', maxHeight: '600px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDMgRIDq561DGmjRL8g0U4k6K7JXS_PUgc" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        center={center}
        yesIWantToUseGoogleMapApiInternals
        zoom={17}
        onGoogleApiLoaded={({map, maps}) => renderMarkers(map, maps)}
        draggable={false}
      >
        
      </GoogleMapReact>
    </div>
  );
}

export default Map;