import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/globals.css";
import axios from "axios";

function Header({ updateAuthenticationStatus, authenticated }) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout');
            updateAuthenticationStatus(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="header-container">
            <Navbar variant="dark" expand="md">
                <Navbar.Brand href="/">Let's Go Camping!</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {authenticated !== false ? (
                        <Nav className="mr-auto">
                            <Nav.Link className = "nav1" tabIndex="0" onClick={() => navigate("/search")}>Search</Nav.Link>
                            <Nav.Link className = "nav2" onClick={() => navigate("/favorites")}>Favorites</Nav.Link>
                            <Nav.Link className = "nav3" onClick={() => navigate("/compare")}>Compare and Suggest</Nav.Link>
                            <Nav.Link className = "nav4" onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav className="ml-auto">
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default Header;
