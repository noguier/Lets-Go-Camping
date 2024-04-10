import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Create from "./pages/Create";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function App() {
    // State to store user authentication status
    const [authenticated, setAuthenticated] = useState(false);

    // Function to check user authentication status periodically
    useEffect(() => {
        // Check user authentication status from the backend
        // make an axios request to backend to check if the user is authenticated
        axios.get("/api/users/authenticated")
            .then(response => {
                //console.log(response.data);
                const isAuthenticated = response.data;
                setAuthenticated(isAuthenticated);
                //console.log("isAuthenticated:" + isAuthenticated);
            })
            .catch(error => {
                console.error("Error checking authentication status:", error);
            });
    }, []);

    //function to update authentication status automatically when login/logout pressed
    const updateAuthenticationStatus = (status) => {
        setAuthenticated(status);
    };



    return (
        <div>
            <header>
                <Header authenticated={authenticated} updateAuthenticationStatus={updateAuthenticationStatus}/>
            </header>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<Login updateAuthenticationStatus={updateAuthenticationStatus}/>}/>
                <Route path="/create" element={<Create/>}/>
                <Route path="/search"
                       element={authenticated ? <Search updateAuthenticationStatus={updateAuthenticationStatus}/> :
                           <Navigate to="/login"/>}/>
                <Route path="/favorites"
                       element={authenticated ? <Favorites updateAuthenticationStatus={updateAuthenticationStatus}/> :
                           <Navigate to="/login"/>}/>
                <Route path="/compare" element={authenticated ? <Compare/> : <Navigate to="/login"/>}/>
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
            <footer>
                <Footer/>
            </footer>
        </div>
    );
}

export default App;


