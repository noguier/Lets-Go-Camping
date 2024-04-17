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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log("Fetching favorite parks...");
                    const favoriteParksResponse  = await fetchFavoriteParks();
                // console.log("Favorite parks fetched:", favoriteParksResponse);
                setFavoriteParks(favoriteParksResponse); // Update state with the list of park codes

                // console.log("Fetching park details for favorite parks...");
                const parkDetailsData = {};
                for (const parkCode of favoriteParksResponse) {
                        parkDetailsData[parkCode] = await fetchParkDetails(parkCode);
                }
                // console.log("Park details for favorite parks fetched:", parkDetailsData);
                setParkDetailsData(parkDetailsData); // Update parkDetails state with fetched details
                // console.log("Updated parkDetails object:", parkDetailsData);

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
            await axios.post('/api/favorites/togglePrivacy',  payload);
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
    // console.log("FAV: Favorite parks:", favoriteParks);
    // console.log("FAV: Park details:", parkDetails);

    //the problem: park details is properly stated and updated, but in the code below, it is undefined
    //this causes for parkDetails to be undefined at it won't show the details
    return (
        <div>
            <h2>Favorites</h2>
            <button onClick={togglePrivacy}>
                {isPublic ? 'Public' : 'Private'}
            </button>
            {favoriteParks && favoriteParks.length > 0 ? (
                favoriteParks.map(parkCode => {
                    const parkDetailsForCode = parkDetailsData[parkCode];
                    // setParkDetails(parkDetailsForCode);
                    // console.log("FAVPark code:", parkCode);
                    // console.log("fAVPark details for code:", parkDetailsForCode)
                    // console.log("fAVProps passed to ParkDetails component:", parkDetailsForCode, parkDetails, setParkDetails);
                    return (
                        // <div className="row mt-4">
                        //     {searchResults.slice(0, resultsToShow).map((park, index) => (
                        //         <div key={index} className="col-12">
                        //             {renderParkInfo(park, parkDetails, setParkDetails, "search", updateSearchResults)}
                //             <hr/>
                //         </div>
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
                            ) : (
                                <p>Loading...</p>
                            )}
                             <hr/>
                        </div>
                    );
                })
                ) : (
                    <div>This list is empty</div>
                )}
                </div>
                )
                    ;


                };

                export default Favorites;

