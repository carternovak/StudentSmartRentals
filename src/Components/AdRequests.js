import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";
import axios from "axios";
import { Button } from "react-bootstrap";

const AdRequests = () => {
    const [ads, setAds] = useState([]);
    const [resolvedAds, setResolvedAds] = useState([]);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/adData/getAdData");
            const unresolvedAds = data.filter(ad => ad.isResolved === false);
            const newResolvedAds = data.filter(ad => ad.isResolved === true);
            // console.log("Unresolved tickets:", unresolvedTickets);
            // console.log("Resolved tickets:", newResolvedTickets);
            setAds(unresolvedAds);
            setResolvedAds(newResolvedAds);
        } catch (error) {
            console.error("Error fetching ad data:", error);
        }

    }

    const approveRequest = async (request) => {
        // TODO: Update the community data to reflect the approved request
        const confirmApprove = await window.confirm("Are you sure you want to aprove this request?")
        if (confirmApprove) {
            console.log("Approving ad");
            const dataToBeSent = {
                isResolved: true,
                isApproved: true,
                closedAt: new Date(),
            };
            const response = await fetch(
                "http://localhost:5000/adData/updateAdData/" + request.adID,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            );
            const data = await response.json();
            fetchAds();
        }
        return;
    }

    const denyRequest = async (request) => {
        // TODO: Delete ticket from backend
        const confirmDelete = await window.confirm("Are you sure you want to deny this request?")
        if (confirmDelete) {
            console.log("Denying ad");
            const dataToBeSent = {
                isResolved: true,
                isApproved: true,
                closedAt: new Date(),
            };
            const response = await fetch(
                "http://localhost:5000/adData/updateAdData/" + request.adID,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            );
            const data = await response.json();
            fetchAds();
        }
        return;
    }

    const parseDate = (dateString) => {
        const dateObject = new Date(dateString);
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        // Extracting day, month, and year
        const day = dateObject.getUTCDate();
        const month = dateObject.getUTCMonth() + 1; // Months are zero-based
        const year = dateObject.getUTCFullYear();


        return monthNames[month - 1] + " " + day + ", " + year;
    }

    return (
        <>
            {ads.map((ad) => (
                <div className="maintenence-request">
                    <div className="request-header">
                        <h3>Ad ID: {ad.apartmentID}</h3>
                        <p>{ad.adID}</p>
                    </div>
                    <p className="request-date">{parseDate(ad.createdAt)}</p>
                    <p>Unit Number: {ad.unitNumber}</p>
                    <p>Owner: {ad.ownerID}</p>
                    <h4 style={{ "marginTop": "40px" }}>Description</h4>
                    <div className="button-container">
                        <p>{ad.description ? ad.description : "No description provided"}</p>
                        <div className="request-buttons">
                            <Button variant="primary" onClick={() => approveRequest(ad)} className="admin-button">Approve</Button>
                            <Button variant="danger" onClick={() => denyRequest(ad)} className="admin-button">Deny</Button>
                        </div>
                    </div>
                </div>))}

            <h2>Past Property Requests</h2>
            {resolvedAds.map((ad) => (
                <div className={`past-request ${ad.isApproved ? "approved" : "denied"}`}>
                    <div className="request-header">
                        <h3>Apartment ID: {ad.apartmentID}</h3>
                        <p>{ad.adID}</p>
                    </div>
                    <p className="request-date">{parseDate(ad.createdAt)}</p>
                    <p>Unit Number: {ad.unitNumber}</p>
                    <p>Owner: {ad.ownerID}</p>
                    <h4 style={{ "marginTop": "40px" }}>Description</h4>
                    <p>{ad.description ? ad.description : "No description provided"}</p>
                    {ad.isApproved ? <p className="approved-text">Approved</p> : <p className="denied-text">Denied</p>}
                </div>))}
        </>
    )
}

export default AdRequests;