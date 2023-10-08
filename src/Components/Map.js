import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Map = () => {
  const defaultProps = {
    center: {
      lat: 39.1721943,
      lng: -86.5099879
    },
    zoom: 14
  };
  
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        return (latitude, longitude);
        // You can do something with the user's location data here
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }

const getUserLatitude = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude } = position.coords;
        console.log(`Latitude: ${latitude}`);
        return latitude;
        // You can do something with the user's location data here
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }

const getUserLongitude = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude } = position.coords;
        console.log(`Longitude: ${longitude}`);
        return longitude;
        // You can do something with the user's location data here
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  }

  const latitude = 1;
  const longitude = 1;   

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', maxHeight: '600px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCmunfUIwKFtwMRI1u96aMx4zgERGD_d1E" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={latitude}
          lng={longitude}
          text="Indiana University"
        />
      </GoogleMapReact>
    </div>
  );
}

export default Map;