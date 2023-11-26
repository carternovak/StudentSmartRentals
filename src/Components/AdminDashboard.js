import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../css/AdminDashboard.css";
import { useUserAuth } from "../context/UserAuthContext";
import Nav from "./Nav";
import axios from "axios";
import { Button } from "react-bootstrap";
import Switch from "react-switch";
import { set } from "mongoose";
import MaintenenceRequests from "./MaintenenceRequests";
import AdRequests from "./AdRequests";

const AdminDashboard = () => {
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const [usingAdView, setUsingAdView] = useState(false);

    useEffect(() => {
        const userRole = getUserRole();
        confirmAdmin(userRole);
    }, []);

    const toggleView = () => {
        setUsingAdView(!usingAdView);
    }

    const getUserRole = () => {
        const userRole = localStorage.getItem("userRole");
        return userRole;
    };

    const confirmAdmin = (role) => {
        if (role !== "admin") {
            navigate("/");
        }
    }    

    return (
        <>
            <Nav />
            <div className="admin-container">
                <h1>Admin Dashboard</h1>
                <div className="admin-content">
                    <div className="requests">
                        <div className="admin-bar">
                            {usingAdView ? <h2>Open Property Requests</h2> : <h2>Open Maintenence Requests</h2>}
                            <Switch 
                                onChange={toggleView} 
                                checked={usingAdView} 
                                checkedIcon={false} 
                                uncheckedIcon={false}
                                offColor="#fcd824"
                                onColor="#ff444e"
                            />
                        </div>
                        {usingAdView ? <AdRequests /> : <MaintenenceRequests />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;