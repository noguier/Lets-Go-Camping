import React, {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {renderParkInfo} from "../components/Result";

const Favorites = () => {
        const [favoriteParks, setFavoriteParks] = useState([]);
        const [parkDetails, setParkDetails] = useState({});
        const [parkDetailsData, setParkDetailsData] = useState({});
        const [isPublic, setIsPublic] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [searchType, setSearchType] = useState('name');
        const [parkRankings, setParkRankings] = useState({});
     const [searchResults, setSearchResults] = useState([]);


        useEffect(() => {
            const fetchData = async () => {
                try {
                    // console.log("Fetching favorite parks...");
                    const favoriteParksResponse = await fetchFavoriteParks();
                    // console.log("Favorite parks fetched:", favoriteParksResponse);
                    setFavoriteParks(favoriteParksResponse); // Update state with the list of park codes

                    // console.log("Fetching park details for favorite parks...");
                    const parkDetailsData = {};
                    const parkRankingsData = {};
                    for (const parkCode of favoriteParksResponse) {
                        parkDetailsData[parkCode] = await fetchParkDetails(parkCode);
                        parkRankingsData[parkCode] = 0;

                        const parkRanking = await fetchParkRanking(parkCode);
                        parkRankingsData[parkCode] = parkRanking || 0;

                    }
                    // console.log("Park details for favorite parks fetched:", parkDetailsData);
                    setParkDetailsData(parkDetailsData); // Update parkDetails state with fetched details
                    // console.log("Updated parkDetails object:", parkDetailsData);
                    setParkRankings(parkRankingsData);
                    const privacyStatus = await fetchPrivacyStatus();
                    setIsPublic(privacyStatus);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }, []);


        const fetchFavoriteParks = async () => {
            try {
                const response = await axios.get('/api/favorites/display');
                // console.log("Response from fetchFavoriteParks:", response);
                return response.data; // Return data directly (list of park codes)
            } catch (error) {
                // console.error('Error fetching favorite parks:', error);
                throw error; // Rethrow the error to be caught in the calling function
            }
        };


    const fetchParkRanking = async (parkCode) => {
        try {
            const response = await axios.get(`/api/favorites/ranking/${parkCode}`);
            const ranking = response.data;
            setParkRankings(prevParkRankings => ({
                ...prevParkRankings,
                [parkCode]: ranking
            }));
            return ranking;
        } catch (error) {
            console.error('Error fetching park rankings:', error);
            return 0; // Return default value if ranking is not available
        }
    };


    const updateSearchResults = (newResults, type) => {
            setSearchType(type);
            setSearchResults(newResults);
        };

    const fetchPrivacyStatus = async () => {
        try {
            const response = await axios.get('/api/favorites/privacy');
            return response.data;
        } catch (error) {
            throw error;
        }
    };


    const togglePrivacy = async () => {
            try {
                const newPrivacyStatus = !isPublic;
                setIsPublic(newPrivacyStatus); // Update state with the new privacy status
                await axios.post('/api/favorites/togglePrivacy', { isPublic: newPrivacyStatus });
            } catch (error) {
                console.error('Error toggling privacy:', error);
                toast.error('Failed to toggle privacy');
            }
        };

        const fetchParkDetails = async (parkCode) => {
            try {
                // console.log("fetchParkDetails:", parkCode);
                const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=parkClick`);
                const data = await response.json();
                // console.log("Response from fetchParkDetails:", data.data[0]);
                return data.data[0]; // Return detailed park information
            } catch (error) {
                console.error('Error fetching park details:', error);
                throw error;
            }
        };


    const removeAll = async () => {
        try {
            if (confirm("Remove all parks from favorites list?") === true) {
                for (const favorite of favoriteParks) {
                    await axios.post('/api/favorites/remove', favorite);
                    console.log("Removed park:", favorite);
                }
                toast.success('Removed all parks from favorites!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

// Update park ranking function
    const updateParkRanking = async (parkCode, increment) => {
        const currentRanking = parkRankings[parkCode] || 0; // Get current ranking or default to 0
        const newRanking = Math.max(1, currentRanking + increment); // Ensure new ranking is at least 1

        try {
            // Send updated ranking to the backend
            await axios.post("/api/favorites/updateRanking", { parkCode, newRanking });
            // Update local state with the new ranking
            setParkRankings({ ...parkRankings, [parkCode]: newRanking });

            // Reorder favorite parks based on updated rankings
            const updatedFavoriteParks = favoriteParks.slice(); // Create a copy of the array
            const parkIndex = updatedFavoriteParks.indexOf(parkCode);
            updatedFavoriteParks.splice(parkIndex, 1); // Remove the park from its current position
            updatedFavoriteParks.splice(newRanking - 1, 0, parkCode); // Insert the park at its new position
            setFavoriteParks(updatedFavoriteParks);
        } catch (error) {
            console.error("Error updating park ranking:", error);
            toast.error("Failed to update park ranking");
        }
    };

    // Remove all function

    return (
        <div>
            <h2>Favorites</h2>
            <button onClick={togglePrivacy}>
                {isPublic ? 'Public' : 'Private'}
            </button>
            <button onClick={removeAll}>Remove All</button>
            {favoriteParks && favoriteParks.length > 0 ? (
                <ol>
                    {favoriteParks.map((parkCode, index) => (
                        <li key={parkCode}>
                            {parkDetailsData[parkCode] ? (
                                // renderParkInfo component
                                <div>
                                    {renderParkInfo(
                                        parkDetailsData[parkCode],
                                        parkDetailsData,
                                        setParkDetailsData,
                                        'favorites',
                                        updateSearchResults
                                    )}
                                    <button onClick={() => updateParkRanking(parkCode, -1)} disabled={index === 0}>↑</button>
                                    <span>{index + 1}</span>
                                    <button onClick={() => updateParkRanking(parkCode, 1)} disabled={index === favoriteParks.length - 1}>↓</button>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </li>
                    ))}
                </ol>
            ) : (
                <div>This list is empty</div>
            )}
        </div>
    );
};

export default Favorites;