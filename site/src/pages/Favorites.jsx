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
                    }
                    // console.log("Park details for favorite parks fetched:", parkDetailsData);
                    setParkDetailsData(parkDetailsData); // Update parkDetails state with fetched details
                    // console.log("Updated parkDetails object:", parkDetailsData);
                    setParkRankings(parkRankingsData);

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

        const updateSearchResults = (newResults, type) => {
            setSearchType(type);
            setSearchResults(newResults);
        };

        const togglePrivacy = async () => {
            try {
                // Send request to backend to toggle privacy
                const payload = {
                    isPublic: isPublic
                }
                await axios.post('/api/favorites/togglePrivacy', payload);
                // Update state
                setIsPublic(!isPublic);
                toast.success(`Favorites set to ${isPublic ? 'private' : 'public'}`);
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

    const updateParkRanking = async (parkCode, increment) => {
        const currentRanking = parkRankings[parkCode] || 0; // Get current ranking or default to 0
        const newRanking = Math.max(0, currentRanking + increment); // Ensure new ranking is at least 0

        try {
            // Send updated ranking to the backend
            await axios.post("/api/favorites/updateRanking", { parkCode, newRanking });
            // Update local state with the new ranking
            setParkRankings({ ...parkRankings, [parkCode]: newRanking });
            console.log("Park ranking is updated");
        } catch (error) {
            console.error("Error updating park ranking:", error);
            toast.error("Failed to update park ranking");
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




    //the problem: park details is properly stated and updated, but in the code below, it is undefined
        //this causes for parkDetails to be undefined at it won't show the details
        return (
            <div>
                <h2>Favorites</h2>
                <button onClick={togglePrivacy}>
                    {isPublic ? 'Public' : 'Private'}
                </button>
                <button onClick={removeAll}>Remove All</button>
                {favoriteParks && favoriteParks.length > 0 ? (
                        favoriteParks.map(parkCode => {
                                const parkDetailsForCode = parkDetailsData[parkCode];
                                return (
                                    <div key={parkCode}>
                                        {parkDetailsForCode ? (
                                                // renderParkInfo(park, parkDetails, setParkDetails, "favorites", updateSearchResults)
                                                renderParkInfo(
                                                    parkDetailsForCode,
                                                    parkDetails,
                                                    setParkDetails,
                                                    'favorites',
                                                    updateSearchResults
                                                )

                                            ) :
                                            (
                                                <p>Loading...</p>
                                            )
                                        }
                                        <button onClick={() => updateParkRanking(parkCode, 1)}>↑</button>
                                        <span>{parkRankings[parkCode]}</span>
                                        <button onClick={() => updateParkRanking(parkCode, -1)}>↓</button>
                                        <hr/>
                                    </div>
                                );
                            }
                        )
                    ) :
                    (
                        <div>This list is empty</div>
                    )
                }
            </div>
        )
            ;


    }
;

export default Favorites;

