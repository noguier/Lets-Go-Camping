import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Create from "./pages/Create"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

//these are all the pages, we can change Compare page to include both features later

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<Create />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    )
}

export default App;