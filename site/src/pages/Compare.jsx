import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, Form, Container } from 'react-bootstrap';
import Header from "../components/Header";

const Compare = ({ updateAuthenticationStatus }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('compare');
    const [error, setError] = useState("");
    const [isFavoritesPublic, setIsFavoritesPublic] = useState(true);
    const [favoritesList, setFavoritesList] = useState([]);
    const [userList, setUserList] = useState([]);  // State to track users with public favorites

    const handleSearch = async () => {
        if (!searchTerm) {
            setError("Please enter a username to search");
            return;
        }

        try {
            const response = await fetch(`/api/users/exists?username=${searchTerm}`);
            const message = await response.text();

            if (message === "User exists") {
                // User exists, proceed to check privacy
                await checkPrivacy();
            } else {
                setError("User does not exist.");
                alert(message);
            }
        } catch (error) {
            setError("Failed to search for user");
            console.error('Error searching user:', error);
        }
    };

    const checkPrivacy = async () => {
        try {
            const response = await fetch(`/api/favorites/privacy/${searchTerm}`, {
                credentials: 'include'
            });
            const isPublic = await response.json();
            setIsFavoritesPublic(isPublic);
            if (response.ok && isPublic) {
                // Only fetch favorites if privacy is public
                await fetchFavorites();
            } else {
                console.log("Favorites list is private.");
            }
        } catch (error) {
            setError("Failed to retrieve privacy status");
            console.error('Error checking privacy:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`/api/favorites/display/${searchTerm}`, {
                credentials: 'include'
            });
            const favorites = await response.json();
            if (response.ok && favorites.length > 0) {
                setFavoritesList(favorites);
                setUserList(prev => [...prev, searchTerm]);  // Add username to user list
                alert("User successfully added");
                console.log("Favorites:", favorites);  // Log the public favorites to console
            } else {
                setFavoritesList([]);
                console.log("This user has no favorites, but we will add it to the list because it is just going to be an empty set ");
                setUserList(prev => [...prev, searchTerm]);
            }
        } catch (error) {
            setError("Failed to retrieve favorites for the specified user");
            //
            // console.error('Error retrieving favorites:', error);
        }
    };

    return (
        <div>
            <h2>Compare and Suggest</h2>
            <Container>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search for user"
                        aria-label="Search for user"
                        aria-describedby="basic-addon2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleSearch}>Search</Button>
                </InputGroup>

                <Form>
                    <Form.Check
                        type="radio"
                        label="Compare Parks"
                        name="option"
                        value="compare"
                        //checked={selectedOption === 'compare'}
                    />
                    <Form.Check
                        type="radio"
                        label="Suggest a Park"
                        name="option"
                        value="suggest"
                        //checked={selectedOption === 'suggest'}
                    />
                </Form>

                {/* Optional: Display the list of users for suggestions */}
                <div>
                    <h3>Users for Park Suggestions:</h3>
                    <ul>
                        {userList.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
            </Container>
        </div>
    );
};

export default Compare;
