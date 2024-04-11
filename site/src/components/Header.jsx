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
        <header className="header-container">
            <Navbar variant="dark" expand="md">
                <Navbar.Brand href="/">Let's Go Camping!</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {authenticated !== false ? (
                        <Nav className="mr-auto">
                            <Nav.Link onClick={() => navigate("/search")}>Search</Nav.Link>
                            <Nav.Link onClick={() => navigate("/favorites")}>Favorites</Nav.Link>
                            <Nav.Link onClick={() => navigate("/compare")}>Compare and Suggest</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav className="ml-auto">
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
