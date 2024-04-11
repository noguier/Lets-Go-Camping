import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header";
const Favorites = ({updateAuthenticationStatus}) => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Favorites</h2>
        </div>
    );
};

export default Favorites;
