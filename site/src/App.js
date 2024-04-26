import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Create from "./pages/Create";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useIdleTimer } from 'react-idle-timer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        axios.get("/api/users/authenticated")
            .then(response => {
                const isAuthenticated = response.data;
                setAuthenticated(isAuthenticated);
            })
            .catch(error => {
                console.error("Error checking authentication status:", error);
            });
    }, []);

    const updateAuthenticationStatus = (status) => {
        setAuthenticated(status);
    };

    const onIdle = () => {
        // Logout the user after 60 seconds of inactivity
        axios.post("/api/users/logout")
            .then(() => {
                setAuthenticated(false);
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
    };

    useIdleTimer({
        timeout: 60000, // 60 seconds
        onIdle: onIdle,
        events: ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove'],
        startOnMount: true,
    });

    return (
        <div>
            {authenticated !== null && (
                <div>
                    <Toaster />
                    <header>
                        <Header authenticated={authenticated} updateAuthenticationStatus={updateAuthenticationStatus} />
                    </header>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login updateAuthenticationStatus={updateAuthenticationStatus} />} />
                        <Route path="/create" element={<Create />} />
                        <Route path="/search" element={authenticated ? <Search updateAuthenticationStatus={updateAuthenticationStatus} /> : <Navigate to="/login" />} />
                        <Route path="/favorites" element={authenticated ? <Favorites updateAuthenticationStatus={updateAuthenticationStatus} /> : <Navigate to="/login" />} />
                        <Route path="/compare" element={authenticated ? <Compare /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                    <footer>
                        <Footer />
                    </footer>
                </div>
            )}
        </div>
    );
}

export default App;




