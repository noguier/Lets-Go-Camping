import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, FormControl, Button, Container } from 'react-bootstrap';
import { renderParkInfo } from "../components/Result";
import Header from "../components/Header";

const Compare = ({ updateAuthenticationStatus }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState("");
    const [isFavoritesPublic, setIsFavoritesPublic] = useState(true);
    const [favoritesList, setFavoritesList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [commonParks, setCommonParks] = useState([]);
    const [suggestedPark, setSuggestedPark] = useState(''); // State for storing the most common park
    const [parkImages, setParkImages] = useState([]);
    useEffect(() => {
        console.log("Updated Favorites List:", favoritesList);
    }, [favoritesList]);

    const handleSearch = async () => {
        if (!searchTerm) {
            setError("Please enter a username to search");
            return;
        }
        try {
            const response = await fetch(`/api/users/exists?username=${searchTerm}`);
            const message = await response.text();

            if (message === "User exists") {
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
                await fetchFavorites();
            } else {

                console.log("Favorites list is private.");
                alert("Favorites list is private.");
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
                setFavoritesList(prev => [...prev, ...favorites]);
                setUserList(prev => [...prev, searchTerm]);
                alert("User successfully added");
            } else {
                console.log("This user has no favorites, but we will add it to the list because it is just going to be an empty set");
                setUserList(prev => [...prev, searchTerm]);
            }
        } catch (error) {
            setError("Failed to retrieve favorites for the specified user");
            console.error('Error retrieving favorites:', error);
        }
    };

    const handleSuggest = async () => {
        const parkCount = {};
        favoritesList.forEach(park => {
            parkCount[park] = (parkCount[park] || 0) + 1;
        });

        const commonPark = Object.keys(parkCount).reduce((a, b) => parkCount[a] > parkCount[b] ? a : b, '');

        // setSuggestedPark(commonPark); // Set the most common park
        alert(`Most common park: ${commonPark}`);
        // const commonPark = Object.keys(parkCount).reduce((a, b) => parkCount[a] > parkCount[b] ? a : b, '');
        setSuggestedPark(commonPark); // Set the most common park
        // Fetch park details based on the park code
        try {
            const response = await fetch(`/api/parks?searchTerm=${commonPark}&searchType=parkClick`);
            const data = await response.json();
            console.log("RESULT: Response from fetchParkDetails:", data.data[0]); // Log the response data
            setSuggestedPark(data.data[0].fullName); // Set the most common park
            const images = data.data[0].images.slice(0,3).map(img => ({
                url: img.url,
                title: img.title
            }));
            setParkImages(images);
            console.log(images);
        } catch (error) {
            console.error('Error fetching park details:', error);
            alert('Fetch Error');
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

                <div>
                    <h3>Users for Park Suggestions:</h3>
                    <ul>
                        {userList.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                    <Button variant="secondary" /*onClick={handleCompare}*/>Compare Parks</Button>
                    <Button variant="info" onClick={handleSuggest}>Suggest a Park</Button>
                    {/*{suggestedPark && <div>Suggested Park: {suggestedPark}</div>}*/}
                    {suggestedPark && <div>
                        <h4>Suggested Park: {suggestedPark}</h4>
                        {parkImages.map((img, index) => (
                            <div key={index}>
                                <img src={img.url} alt={img.title} style={{ width: "100%", height: "auto" }} />

                            </div>
                        ))}
                    </div>}
                </div>
            </Container>
        </div>
    );
};

export default Compare;

