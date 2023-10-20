import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import '../css/Nav.css';
import Logo from "../images/LogoWithoytBG.png";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router";

function Nav() {
    const { logOut, user } = useUserAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
        console.log(error.message);
    }
    };
    return (
        <nav className='navbar'>
            <div className='nav-container'>
                <div className='link-container'>
                    <ul className="nav-links">
                        <Link to='/rent'>
                            <li>Rent</li>
                        </Link>
                        <Link to='/sell'>
                            <li>Sell</li>
                        </Link>
                        <Link to='/iub-support'>
                            <li>IUB Support</li>
                        </Link>
                    </ul>
                </div>
                <div className='link-container'>
                    <img src={Logo} style={{ width: "40px", height: "40px" }} alt='StudentSmart Rentals Logo' />
                </div>
                <div className='link-container'>
                    <ul className="nav-links2">
                        <Link to='/help'>
                            <li>Help</li>
                        </Link>
                        <Link to='/chat'>
                            <li>Chat</li>
                        </Link>
                        <Button className='logout' variant='primary' onClick={handleLogout} style={{ backgroundColor: '#d90d32', color: 'white', border: 'none' }}>Logout</Button>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
