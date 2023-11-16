import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import Nav from "./Nav";
import axios from "axios";
import { Button } from "react-bootstrap";

const AdminDashboard = () => {
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const [maintenanceTickets, setMaintenanceTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);

    useEffect(() => {
        const userRole = getUserRole();
        confirmAdmin(userRole);
        fetchMaintenanceTickets();
    }, []);

    const getUserRole = () => {
        const userRole = localStorage.getItem("userRole");
        return userRole;
    };

    const confirmAdmin = (role) => {
        console.log("USER: ", user);
        console.log("USER NAME: ", user.displayName);
        if (role !== "admin") {
            navigate("/");
        }
    }

    const fetchMaintenanceTickets = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/maintenanceData/getMaintenanceData");
            const unresolvedTickets = data.filter(ticket => ticket.isResolved === false);
            const newResolvedTickets = data.filter(ticket => ticket.isResolved === true);
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
            console.log(data);
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
            <Nav />
            <div className="admin-container">
                <h1>Admin Dashboard</h1>
                <div className="admin-content">
                    <div className="maintenence-requests">
                        <h2>Open Maintenence Requests</h2>
                        {maintenanceTickets.map((ticket) => (
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
                                    <p>{ticket.description ? ticket.description : "No description provided"}</p>
                                    <div className="request-buttons">
                                        <Button variant="primary" onClick={() => approveRequest(ticket)} className="admin-button">Approve</Button>
                                        <Button variant="danger" onClick={() => denyRequest(ticket)} className="admin-button">Deny</Button>
                                    </div>
                                </div>
                            </div>))}

                        <h2>Past Maintenence Requests</h2>
                        {resolvedTickets.map((ticket) => (
                            <div className="past-request">
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
                            </div>))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;