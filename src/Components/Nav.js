import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../css/Nav.css";
import Logo from "../images/LogoWithoytBG.png";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";

function Nav() {
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); // State to store the user role

  useEffect(() => {
    fetchUserRole();
  }, []); // Fetch the user role when the component mounts

  const fetchUserRole = async () => {
    try {
      const docSnapshot = await getDoc(doc(db, "users", user.uid));
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const role = userData.role;
        setUserRole(role); // Update the userRole state with the fetched role
      } else {
        console.log("Document doesn't exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="link-container">
          <ul className="nav-links">
            <Link to="/rent">
              <li>Rent</li>
            </Link>
            {userRole === "owner" && (
              <Link to="/sell">
                <li>Sell</li>
              </Link>
            )}
            <Link to="/iub-support">
              <li>IUB Support</li>
            </Link>
          </ul>
        </div>
        <div className="link-container">
          <img
            src={Logo}
            style={{ width: "40px", height: "40px" }}
            alt="StudentSmart Rentals Logo"
          />
        </div>
        <div className="link-container">
          <ul className="nav-links2">
            <Link to="/help">
              <li>Help</li>
            </Link>
            <Link to="/chat">
              <li>Chat</li>
            </Link>
            <Link to="/profile">
              <li>Profile</li>
            </Link>
            <Button
              className="logout"
              variant="primary"
              onClick={handleLogout}
              style={{
                backgroundColor: "#d90d32",
                color: "white",
                border: "none",
              }}
            >
              Logout
            </Button>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
