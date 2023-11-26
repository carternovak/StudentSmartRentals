import React from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import "../css/Property.css";

const Apartments = ({selectedProperty}) => {

    return (
        <div className="apartments-container">
                <>
                  <h2 className="text-center">Apartments</h2>
                  <div className="apartment">
                    <h3>{selectedProperty.CommApartments.AptName}</h3>
                    <div className="unit">
                    <Button 
                      className="availability"
                      variant={selectedProperty.CommApartments.AptUnits.IsAvailable ? "success" : "danger"}
                    >
                      {selectedProperty.CommApartments.AptUnits.IsAvailable ? "Available" : "Unavailable"}
                    </Button>
                      <h4>{selectedProperty.CommApartments.AptUnits.UnitNumber}</h4>
                      <p style={{color: "#d90d32"}}>${selectedProperty.CommApartments.AptUnits.UnitPrice}</p>
                      <h5 style={{textAlign: "center"}}>Unit Images</h5>
                      <div className="unit-images">
                        {selectedProperty.CommApartments.AptUnits.Unit_Images.map((image) => (
                          <img src={image} />
                        ))}
                      </div>
                      <h5>Features:</h5>
                      <ul>
                        {selectedProperty.CommApartments.AptUnits.UnitFeatures.map((feature) => (
                          <li>{feature}</li>
                        ))}
                      </ul>
                      <h5>Unit Details:</h5>
                      <p><strong>Bedrooms:</strong> {selectedProperty.CommApartments.AptUnits.Bedrooms}</p>
                      <p><strong>Bathrooms:</strong> {selectedProperty.CommApartments.AptUnits.Bathrooms}</p>
                      <p><strong>Unit SQFT:</strong> {selectedProperty.CommApartments.AptUnits.SQFT}</p>
                      <Link to={selectedProperty.CommApartments.AptUnits.HomeTourLink}>{selectedProperty.CommApartments.AptUnits.HomeTourLink}</Link>
                    </div>
                  </div>
                </>
            </div>
    );
}

export default Apartments;