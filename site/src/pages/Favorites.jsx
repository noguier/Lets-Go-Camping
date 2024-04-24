import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { renderParkInfo } from "../components/Result";

const Favorites = () => {
    const [favoriteParks, setFavoriteParks] = useState([]);
    const [parkDetailsData, setParkDetailsData] = useState({});
    const [parkRankings, setParkRankings] = useState({});

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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

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

    const fetchParkDetails = async (parkCode) => {
        try {
            const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=parkClick`);
            const data = await response.json();
            return data.data[0];
        } catch (error) {
            console.error('Error fetching park details:', error);
            throw error;
        }
    };

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
            setFavoriteParks(updatedFavoriteParks);
        } catch (error) {
            console.error("Error updating park ranking:", error);
            toast.error("Failed to update park ranking");
        }
    };

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
            ) : (
                <div>This list is empty</div>
            )}
        </div>
    );
};

export default Favorites;


