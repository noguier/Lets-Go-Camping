import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { renderParkInfo } from "../components/Result";

const Favorites = () => {
    const [favoriteParks, setFavoriteParks] = useState([]);
    const [parkDetailsData, setParkDetailsData] = useState({});
    const [parkRankings, setParkRankings] = useState({});

// <<<<<<< feature/favorites

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
// =======
    useEffect(() => {
        const fetchData = async () => {
            try {
                const favoriteParksResponse = await fetchFavoriteParks();
                setFavoriteParks(favoriteParksResponse);

                const parkDetailsData = {};
                const parkRankingsData = {};
                for (const [index, parkCode] of favoriteParksResponse.entries()) {
                    parkDetailsData[parkCode] = await fetchParkDetails(parkCode);
                    parkRankingsData[parkCode] = index + 1; // Set default ranking based on index
                }
                setParkDetailsData(parkDetailsData);
                setParkRankings(parkRankingsData);
// >>>>>>> develop
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

// <<<<<<< feature/favorites
// =======
        fetchData();
    }, []);

    const fetchFavoriteParks = async () => {
        try {
            const response = await axios.get('/api/favorites/display');
            return response.data;
        } catch (error) {
            throw error;
        }
    };
// >>>>>>> develop

    const fetchParkDetails = async (parkCode) => {
        try {
// <<<<<<< feature/favorites
            if (confirm("Remove all parks from favorites list?") === true) {
                for (const favorite of favoriteParks) {
                    await axios.post('/api/favorites/remove', favorite);
                    console.log("Removed park:", favorite);
                }
                toast.success('Removed all parks from favorites!');
                window.location.reload();
            }
// =======
            const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=parkClick`);
            const data = await response.json();
            return data.data[0];
// >>>>>>> develop
        } catch (error) {
            console.error('Error fetching park details:', error);
            throw error;
        }
    };

// <<<<<<< feature/favorites/
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
// =======
    const updateParkRanking = async (parkCode, increment) => {
        const currentRanking = parkRankings[parkCode] || favoriteParks.length;
        const newRanking = Math.max(1, Math.min(favoriteParks.length, currentRanking + increment));

        try {
            await axios.post("/api/favorites/updateRanking", { parkCode, newRanking });
            setParkRankings({ ...parkRankings, [parkCode]: newRanking });

            const updatedFavoriteParks = favoriteParks.slice();
            const currentIndex = updatedFavoriteParks.indexOf(parkCode);
            updatedFavoriteParks.splice(currentIndex, 1);
            updatedFavoriteParks.splice(newRanking - 1, 0, parkCode);
// >>>>>>> develop
            setFavoriteParks(updatedFavoriteParks);
        } catch (error) {
            console.error("Error updating park ranking:", error);
            toast.error("Failed to update park ranking");
        }
    };

// <<<<<<< feature/favorites
 

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
// =======
    return (
        <div>
            <h2>Favorites</h2>
            {favoriteParks && favoriteParks.length > 0 ? (
                favoriteParks.map(parkCode => {
                    const parkDetailsForCode = parkDetailsData[parkCode];
                    return (
                        <div key={parkCode}>
                            {parkDetailsForCode ? (
                                renderParkInfo(
                                    parkDetailsForCode,
                                    parkDetailsData,
                                    setParkDetailsData,
                                    'favorites'
                                )
                            ) : (
                                <p>Loading...</p>
                            )}
                            <button onClick={() => updateParkRanking(parkCode, -1)}>↑</button>
                            <span>{parkRankings[parkCode]}</span>
                            <button onClick={() => updateParkRanking(parkCode, 1)}>↓</button>
                            <hr />
                        </div>
                    );
                })
// >>>>>>> develop
            ) : (
                <div>This list is empty</div>
            )}
        </div>
    );
};



export default Favorites;


// >>>>>>> develop
