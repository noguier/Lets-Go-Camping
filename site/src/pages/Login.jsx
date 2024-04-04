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
        <div className="bg-image">
            <div className="bg-text">
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/create")}>
                        Don't have an account? Sign Up
                    </Button>
                </Form>
                {error && <Alert variant="danger">{error}</Alert>}
            </div>
        </div>
    );
};
export default Login;
