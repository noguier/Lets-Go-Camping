import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const Create = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!username && !password) {
            //setError('Account Creation Unsuccessful, username and password required');
            setError('Username and password required');
            return;
        }
        else if (!username) {
            //setError('Account Creation Unsuccessful, username required');
            setError('Username required');
            return;
        }
        else if (!password) {
            //setError('Account Creation Unsuccessful, password required');
            setError('Password required');
            return;
        }
        else if (!confirmPassword) {
            //setError('Account Creation Unsuccessful, confirm password required');
            setError('Confirm password required');
            return;
        }

        if (password !== confirmPassword) {
            //setError('Account Creation Unsuccessful, passwords must match');
            setError('Passwords must match');
            return;
        }

        // Make API call to create account
        try {
            await axios.post('/api/users/create', { username, password });
            // Handle success (e.g., redirect to login page)
            navigate('/login'); // Navigate to /login
            setError('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response.data);
        }
    };

    return (
        <div className="bg-image">
            <div className="bg-text">
            <h2>Create Account</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="create-username">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </Form.Group>

                <Form.Group controlId="create-password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </Form.Group>

                <Form.Group controlId="confirm-password">
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Account
                </Button>
                <Button variant="secondary" onClick={() => navigate("/login")}>
                    Already have an account? Login
                </Button>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
        </div>
    );
};

export default Create;


