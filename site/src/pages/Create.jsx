import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const customModalStyles = {
    overlay:{
        backdropFilter: 'blur(5px)',
        background: 'rgba(4,5,7,0.25)',
    },
    content: {
        top: '30%',
        bottom: '30%',
        left: '30%',
        right: '30%',
        overflowY: 'auto',
        background: 'rgb(211,211,211)',
        boxShadow: '3px 5px 10px rgba(46,56,73,0.5)',
        borderRadius: '8px',
        outline: 'none',
        border: 'none',
        color: 'white' // Changed text color to white
    }
};


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

    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        // Prevent scrolling on the original page when the modal is open
        if (modalIsOpen) {
            document.body.style.overflow = 'hidden';
            return ()=> document.body.style.overflow = 'unset';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [modalIsOpen]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="bg-image">
            <div className="bg-text">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="View Startup Modal"
                    style={customModalStyles}
                    blockScroll={true}
                >
                    {/* Modal content */}
                    <h2 className="text-lg font-semibold">Are you sure you want to cancel creating this account?</h2>
                    <p>None of this data will be saved.</p>
                    <button data-testid="cancel-create-account-btn" onClick={() => navigate("/login")}>Cancel Create Account
                    </button>
                    <button onClick={closeModal}>Go Back to Create</button>
                </Modal>

            </form>
            {error && <div>{error}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="create-username" className="my-2">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        variant = "my-2"
                    />
                </Form.Group>

                <Form.Group controlId="create-password" className="my-2">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </Form.Group>

                <Form.Group controlId="confirm-password" className="my-2">
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                    />
                </Form.Group>

                <Button variant="primary mx-2 my-2" type="submit">
                    Create Account
                </Button>
                <Button variant="success mx-2 my-2" onClick={openModal}>
                    Already have an account? Login
                </Button>
            </Form>
            {error && <Alert variant="danger">{error}</Alert>}
        </div>
        </div>
    );
};

export default Create;



