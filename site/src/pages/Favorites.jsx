import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
const Favorites = ({updateAuthenticationStatus}) => {
    const navigate = useNavigate();

    // Function to handle logout
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
        <div>
            <h2>Favorites</h2>
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Favorites;
