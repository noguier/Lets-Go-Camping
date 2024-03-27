import React, { useState } from 'react';
import axios from 'axios';
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
        <div>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="create-username">Username:</label>
                    <input type="text" id="create-username" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="create-password">Password:</label>
                    <input type="password" id="create-password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <div>
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input type="password" id="confirm-password" value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>


                <button type="submit">Create Account</button>
                <button onClick={() => navigate("/login")}>Already have an account? Login</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Create;



