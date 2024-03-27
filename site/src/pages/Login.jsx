import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Login = ({ updateAuthenticationStatus }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!username && !password) {
            setError('Login Unsuccessful, Username and password are required');
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit">Login</button>
                <button onClick={() => navigate("/create")}>Don't have an account? Sign Up</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Login;

