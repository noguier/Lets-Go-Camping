import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Form, Button, Alert } from 'react-bootstrap';
import '../styles/globals.css';
const Login = ({ updateAuthenticationStatus }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!username && !password) {
            setError('Username and password are required');
            return;
        }
        else if (!username) {
            setError('Login Unsuccessful, Username required');
            return;
        }
        else if (!password) {
            setError('Login Unsuccessful, Password required');
            return;
        }

        try {
            // Make API call to login
            const response = await axios.post('/api/users/login', { username, password });

            // Handle successful login
            setError('');
            updateAuthenticationStatus(true); // Update authentication status
            navigate('/search');
        } catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <>
        <title>Login - Let's Go Camping! (Team 17)</title>
        <div className="bg-image">
        <div className="bg-text">
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username" className="my-2">
                        <Form.Label htmlFor="username">Username:</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            aria-label="Username"
                            variant = "my-2"
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="my-2">
                        <Form.Label htmlFor="password">Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            aria-label="Password"
                        />
                    </Form.Group>

                    <Button variant="primary mx-2 my-2" type="submit" aria-label="Login">
                        Login
                    </Button>
                    <Button variant="success mx-2 my-2" onClick={() => navigate("/create")}>
                        Don't have an account? Sign Up
                    </Button>
                </Form>
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
            </div>
        </div>
        </>
    );
};
export default Login;
