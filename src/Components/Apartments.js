import React, { useEffect, useState } from 'react';

import Unit from './Unit';
import "react-image-gallery/styles/css/image-gallery.css";
import "../css/Property.css";
import axios from "axios";

const Apartments = ({ selectedProperty }) => {
  const [owners, setOwners] = useState(null);
  const [owner, setOwner] = useState(null);
  const [unitOwner, setUnitOwner] = useState(null);

  const GetOwner = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/ownerData/getAllOwnersData");
      setOwners(data);
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  }
  
  useEffect(() => {
    if (!owners) {
      GetOwner();
    } else {
      const selectedOwner = owners.find(potentialOwner => potentialOwner.CommunityID === selectedProperty.CommunityID);
      if (selectedOwner) {
        setOwner(selectedOwner);
        GetUnitOwner(selectedProperty.CommApartments.AptUnits.UnitNumber);
      }
    }
  }, [owners, selectedProperty]);

  const GetUnitOwner = (unitID) => {
    const newUnitOwner = owners.find(potentialOwner => potentialOwner.UnitOwner.AptUnit.UnitID === unitID);
    if (newUnitOwner) {
      setUnitOwner(newUnitOwner);
    }
  }


  return (
    <div className="apartments-container">
      <>
        <h1 className="text-center">Apartments</h1>
        <div className="apartment">
          <h2>{selectedProperty.CommApartments.AptName}</h2>
          {selectedProperty.CommApartments.AptUnits && (
            <Unit
              unitDetails={selectedProperty.CommApartments.AptUnits}
              unitOwner={unitOwner}
            />
          )}
        </div>
      </>
    </div>
  );
}

export default Apartments;