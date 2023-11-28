import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ImageGallery from "react-image-gallery";
import "../css/Property.css";

const Unit = ({ unitDetails, unitOwner }) => {
    const [showingOwnerDetails, setShowingOwnerDetails] = useState(false);

    return (
        <>
            {showingOwnerDetails && (
                <>
                    <div className='owner-box'>
                        <div className='owner-details'>
                            <span className='owner-title'>
                                <h4>Owner Details</h4>
                                <Button variant='danger' onClick={() => setShowingOwnerDetails(false)}>Close</Button>
                            </span>
                            <hr />
                            <p><strong>Name:</strong> {unitOwner.UnitOwner.AptUnit.UnitOwnerName} {unitOwner.LastName}</p>
                            <p><strong>Email:</strong> {unitOwner.UnitOwner.AptUnit.UnitOwnerEmail}</p>
                            <p><strong>Phone:</strong> {unitOwner.UnitOwner.AptUnit.UnitOwnerPhone}</p>
                            <p><strong>Address:</strong> {unitOwner.UnitOwner.AptUnit.UnitOwnerAddress}</p>
                        </div>
                    </div>
                </>
            )}
            <div className="unit">
                <div className='unit-layout'>
                    <Button className="availability" variant={unitDetails.IsAvailable ? "success" : "danger"}>
                        {unitDetails.IsAvailable ? "Available" : "Unavailable"}
                    </Button>
                    <div>
                        <h3>Unit: {unitDetails.UnitNumber}</h3>
                        <p style={{ color: "#d90d32" }}>${unitDetails.UnitPrice}/mo</p>

                        <div>
                            <h5>Features:</h5>
                            <hr />
                            <ul className='features'>
                                {unitDetails.UnitFeatures.map((feature) => (
                                    <li><p>{feature}</p></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5>Unit Details:</h5>
                            <hr />
                            <ul className='features'>
                                <li><p>{unitDetails.Bedrooms} Bedrooms</p></li>
                                <li><p>{unitDetails.Bathrooms} Bathrooms</p></li>
                                <li><p>{unitDetails.SQFT} SQFT</p></li>
                            </ul>
                        </div>
                        <p>Tour: <Link target='_blank' to={unitDetails.HomeTourLink}>{unitDetails.HomeTourLink}</Link></p>
                    </div>
                    {unitOwner && (
                        <Button variant='primary' onClick={() => setShowingOwnerDetails(true)}>Contact Owner</Button>
                    )}
                </div>
                {unitDetails.Unit_Images.length > 0 && (
                    <div className="unit-images">
                        <h5 style={{ textAlign: "center", fontWeight: "bold" }}>Unit Images</h5>
                        <ImageGallery autoPlay={true} items={unitDetails.Unit_Images.map(
                            (image) => ({ original: image, thumbnail: image })
                        )} />
                    </div>
                )}
            </div>
        </>
    )
}

export default Unit;