import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header"
import Footer from "./components/Footer"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Favorites from "./pages/Favorites"
import Compare from "./pages/Compare"

//these are all the pages, we can change Compare page to include both features later

function App() {
    return (
        <div>
            <header>
                <Header/>
            </header>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/search" element={<Search/>}/>
                <Route path="/favorites" element={<Favorites/>}/>
                <Route path="/compare" element={<Compare/>}/>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default App;

