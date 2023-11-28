import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../css/Nav.css";
import Logo from "../images/logo.png";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import Modal from "react-bootstrap/Modal";
function Nav() {
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(() => {
    // Load userRole from localStorage on component mount
    return localStorage.getItem("userRole") || "";
  }); // State to store the user role

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
        localStorage.setItem("userRole", role);
      } else {
        console.log("Document doesn't exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleLogout = async () => {
    try {
      localStorage.clear();
      await logOut();
      setUserRole(""); // Reset userRole to an empty string upon logout
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
            {userRole !== "" && (
              <Link to="/">
                <li>Rent</li>
              </Link>
            )}
            {(userRole === "owner" || userRole === "admin" ) && (
              <Link to="/sell">
                <li>Sell</li>
              </Link>
            )}
            {userRole !== "" && (
              <Link to="/iub-support">
                <li>IUB Support</li>
              </Link>
            )}
            {userRole === "admin" && (
              <Link to="/admin">
                <li>Admin</li>
              </Link>
            )}
          </ul>
        </div>
        <div className="link-container">
          <Link to="/">
            <img
              src={Logo}
              style={{ width: "350px", height: "55px" }}
              alt="StudentSmart Rentals Logo"
            />
          </Link>
        </div>
        <div className="link-container">
          <ul className="nav-links2">
            {userRole !== "" && (
              <Link to="/help">
                <li>Help</li>
              </Link>
            )}
            {userRole !== "" && (
              <Link to="/chat">
                <li>Chat</li>
              </Link>
            )}
            {userRole !== "" && (
              <Link to="/profile">
                <li>Profile</li>
              </Link>
            )}
            {userRole === "" ? (
              <Button
                className="login"
                variant="primary"
                onClick={handleLogin}
                style={{
                  backgroundColor: "#d90d32",
                  color: "white",
                  border: "none",
                  maxWidth: "80px", // Set a minimum width for the button
                  padding: "8px 16px", // Set padding to control the size
                }}
              >
                Login
              </Button>
            ) : (
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
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
