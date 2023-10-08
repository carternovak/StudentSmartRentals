import React from 'react';
import Property from './Property';

const PropertyDetails = ({ property }) => {
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