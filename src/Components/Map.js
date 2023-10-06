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

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', maxHeight: '600px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCmunfUIwKFtwMRI1u96aMx4zgERGD_d1E" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={39.1721943}
          lng={-86.5099879}
          text="Indiana University"
        />
      </GoogleMapReact>
    </div>
  );
}

export default Map;