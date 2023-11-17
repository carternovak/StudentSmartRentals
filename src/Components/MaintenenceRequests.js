import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import Loading from "../images/loading.gif";

const MaintenenceRequests = () => {
    const [maintenanceTickets, setMaintenanceTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);

    useEffect(() => {
        fetchMaintenanceTickets();
    }, []);

    const fetchMaintenanceTickets = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/maintenanceData/getMaintenanceData");
            const unresolvedTickets = data.filter(ticket => ticket.isResolved === false);
            const newResolvedTickets = data.filter(ticket => ticket.isResolved === true);
            // console.log("Unresolved tickets:", unresolvedTickets);
            // console.log("Resolved tickets:", newResolvedTickets);
            setMaintenanceTickets(unresolvedTickets);
            setResolvedTickets(newResolvedTickets);
        } catch (error) {
            console.error("Error fetching community data:", error);
        }

    }

    const approveRequest = async (request) => {
        // TODO: Update the community data to reflect the approved request
        const confirmApprove = await window.confirm("Are you sure you want to aprove this request?")
        if (confirmApprove) {
            console.log("Approving ticket");
            const dataToBeSent = {
                isResolved: true,
                isApproved: true,
                closedAt: new Date(),
            };
            const response = await fetch(
                "http://localhost:3001/maintenanceData/updateMaintenanceData/" + request.ticketID,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            );
            const data = await response.json();
            fetchMaintenanceTickets();
        }
        return;
    }

    const denyRequest = async (request) => {
        // TODO: Delete ticket from backend
        const confirmDelete = await window.confirm("Are you sure you want to deny this request?")
        if (confirmDelete) {
            console.log("Denying ticket");
            const dataToBeSent = {
                isResolved: true,
                isApproved: false,
                closedAt: new Date(),
            };
            const response = await fetch(
                "http://localhost:3001/maintenanceData/updateMaintenanceData/" + request.ticketID,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            );
            const data = await response.json();
            fetchMaintenanceTickets();
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

    const deleteRequest = async (request) => {
        const confirmDelete = await window.confirm("Are you sure you want to delete this request?")
        if (confirmDelete) {
            console.log("Deleting ticket");
            const response = await fetch(
                "http://localhost:3001/maintenanceData/deleteMaintenanceData/" + request.ticketID,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            fetchMaintenanceTickets();
        }
        return;
    }

    const reopenRequest = async (request) => {
        const confirmReopen = await window.confirm("Are you sure you want to reopen this request?")
        if (confirmReopen) {
            console.log("Reopening ticket");
            const dataToBeSent = {
                isResolved: false,
                isApproved: false,
                closedAt: undefined,
            };
            const response = await fetch(
                "http://localhost:3001/maintenanceData/updateMaintenanceData/" + request.ticketID,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToBeSent),
                }
            );
            const data = await response.json();
            fetchMaintenanceTickets();
        }
        return;
    }

    return (
        <>
            {maintenanceTickets ? (
                maintenanceTickets.map((ticket) => (
                    <div className="maintenence-request">
                        <div className="request-header">
                            <h3>Apartment ID: {ticket.apartmentID}</h3>
                            <p>{ticket.ticketID}</p>
                        </div>
                        <p className="request-date">{parseDate(ticket.createdAt)}</p>
                        <p>Type: {ticket.issueType}</p>
                        <p>Unit Number: {ticket.unitNumber}</p>
                        <p>Owner: {ticket.ownerID}</p>
                        <p>User: {ticket.userID}</p>
                        <h4 style={{ "marginTop": "40px" }}>Description</h4>
                        <div className="button-container">
                            <p id="description">{ticket.description ? ticket.description : "No description provided"}</p>
                            <div className="request-buttons">
                                <Button variant="primary" onClick={() => approveRequest(ticket)} className="admin-button">Approve</Button>
                                <Button variant="danger" onClick={() => denyRequest(ticket)} className="admin-button">Deny</Button>
                            </div>
                        </div>
                    </div>))) : (<img src={Loading} alt="Loading" style={{margin: "0 auto", display: "flex"}} />)}

            <h2>Past Maintenence Requests</h2>
            {resolvedTickets ? (
            resolvedTickets.map((ticket) => (
                <div className={`past-request ${ticket.isApproved ? "approved" : "denied"}`}>
                    <div className="request-header">
                        <h3>Apartment ID: {ticket.apartmentID}</h3>
                        <p>{ticket.ticketID}</p>
                    </div>
                    <p className="request-date">{parseDate(ticket.createdAt)}</p>
                    <p>Type: {ticket.issueType}</p>
                    <p>Unit Number: {ticket.unitNumber}</p>
                    <p>Owner: {ticket.ownerID}</p>
                    <p>User: {ticket.userID}</p>
                    <h4 style={{ "marginTop": "40px" }}>Description</h4>
                    <p>{ticket.description ? ticket.description : "No description provided"}</p>
                    <div className="button-container">
                        {ticket.isApproved ? <p className="approved-text">Approved</p> : <p className="denied-text">Denied</p>}
                        <div className="request-buttons">
                            <Button variant="primary" onClick={() => reopenRequest(ticket)} className="admin-button">Reopen</Button>
                            <Button variant="danger" onClick={() => deleteRequest(ticket)} className="admin-button">Delete</Button>
                        </div>
                    </div>
                </div>))) : (<img src={Loading} alt="Loading" style={{margin: "0 auto", display: "flex"}} />)}
        </>
    )
}

export default MaintenenceRequests;