import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {InputGroup, FormControl, Button, Container, Form} from 'react-bootstrap';
import toast from "react-hot-toast";
import { renderParkInfo } from "../components/Result";

const Compare = ({ updateAuthenticationStatus }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState("");
    const [isFavoritesPublic, setIsFavoritesPublic] = useState(true);
    const [favoritesList, setFavoritesList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [commonParks, setCommonParks] = useState([]);
    const [suggestedPark, setSuggestedPark] = useState(''); // State for storing the most common park
    const [suggestedParkDetails, setSuggestedParkDetails] = useState(''); // State for storing the most common park
    const [parkDetails, setParkDetails] = useState(''); // State for storing the most common park
    const [parkImages, setParkImages] = useState([]);
    const [searchType, setSearchType] = useState('name');
    const [commonParkDetails, setCommonParkDetails] = useState({});
    const [triggerRerender, setTriggerRerender] = useState(false);


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
            console.log(response);
            if (response.ok && favorites.length > 0) {
                setFavoritesList(prev => [...prev, ...favorites]);
                setUserList(prev => [...prev, searchTerm]);
                toast.success("User successfully added");
            } else {
                // console.log("This user has no favorites, but we will add it to the list because it is just going to be an empty set");
                // setUserList(prev => [...prev, searchTerm]);
                console.log("Existed user but with an empty list");
                toast.error("Favorites list is private");
            }
        } catch (error) {
            setError("Failed to retrieve favorites for the specified user");
            console.error('Error retrieving favorites:', error);
        }
    };

    const updateSearchResults = (newResults, type) => {
        setSearchType(type);
        setSearchResults(newResults);
    };

    const handleSuggest = async () => {
        const parkCount = {};
        favoritesList.forEach(park => {
            parkCount[park] = (parkCount[park] || 0) + 1;
        });
        // Get the maximum count value only if it is greater than 1
        const maxCount = Math.max(0, ...Object.values(parkCount).filter(count => count > 1));

// Filter keys where the value equals maxCount and maxCount is greater than 1
        const commonParks = Object.keys(parkCount).filter(park => parkCount[park] === maxCount && maxCount > 1);
        console.log("common parks length "+ commonParks.length);
        console.log("common parks array",commonParks);
        if (commonParks.length > 1) {
            let userSpecificParks = {};

            // Gather ratings for each park by each user who listed it as a favorite
            for (const user of userList) {
                for(const park of commonParks) {
                    try {
                        const response = await fetch(`/api/favorites/ranking/${user}/${park}`);
                        const rating = await response.json();
                        console.log("Fetched user rankins " + rating);
                        if (!userSpecificParks[park]) {
                            userSpecificParks[park] = [];
                        }
                        userSpecificParks[park].push(rating);
                        console.log("common parks amd thier favorites list", userSpecificParks)

                    } catch (error) {
                        console.error('Error fetching park ratings:', error);
                        alert('Error fetching park ratings');
                        return;
                    }
                }
            }

            // Calculate average ratings for each park
            const parksWithAverageRatings = Object.entries(userSpecificParks).map(([park, ratings]) => ({
                park,
                averageRating: ratings.reduce((a, b) => a + b, 0) / ratings.length

            }));
            console.log(parksWithAverageRatings);

            // Sort parks by average rating and select the highest rated one
            parksWithAverageRatings.sort((a, b) => a.averageRating - b.averageRating);
            const highestRatedPark = parksWithAverageRatings[0].park;

            setSuggestedPark(highestRatedPark);
            console.log(suggestedPark);
            await fetchParkDetails(highestRatedPark);
            toast.success(`Most common park with the highest average rating: ${highestRatedPark}`);
        } else if (commonParks.length === 1){
            const commonPark = commonParks[0];
            setSuggestedPark(commonPark);
            console.log(suggestedPark);
            toast.success(`Most common park: ${commonPark}`);
        }
        //no parks in teh intersection
        else {
            let parksAndLocations = [];
            for (const fav of favoritesList) {
                console.log("favorite" + fav)
                try {
                    const response = await fetch (`/api/parks?searchTerm=${fav}&searchType=parkClick`);
                    const data = await response.json();
                    console.log(data.data[0].states);
                    parksAndLocations.push([fav, data.data[0].states])
                    console.log("Park and locations array", parksAndLocations);

                }
                catch(error) {
                    console.error('Error fetching park details:', error);
                    alert('Fetch Error');
                }
            }
            let stateCount = {};
            parksAndLocations.forEach(([park, state]) => {
                if (stateCount[state]) {
                    stateCount[state] += 1;
                } else {
                    stateCount[state] = 1;
                }
            });

            console.log(stateCount);
            let mostFrequentState = '';
            let maxCount = 0;

            // Iterate over the stateCount object to find the state with the maximum count
            for (const [state, count] of Object.entries(stateCount)) {
                if (count > maxCount) {
                    maxCount = count;
                    mostFrequentState = state;
                }
            }
            console.log(`The most frequent state is ${mostFrequentState} with a count of ${maxCount}.`);
            let parksInMostFrequentState = parksAndLocations.filter(([park, state]) => state === mostFrequentState).map(([park]) => park);
            let parksRankings = [];

            for (const park of parksInMostFrequentState) {
                let totalRating = 0;
                let ratingsCount = 0;
                for (const user of userList) { // userList should be an array of user IDs or usernames
                    try {
                        const response = await fetch(`/api/favorites/ranking/${user}/${park}`);
                        const rating = await response.json();
                        totalRating += rating;
                        ratingsCount++;
                    } catch (error) {
                        console.error('Error fetching rankings for park:', error);
                        alert('Fetch Error');
                    }
                }
                if (ratingsCount > 0) {
                    parksRankings.push({ park, averageRating: totalRating / ratingsCount });
                }
            }

            if (parksRankings.length > 0) {
                parksRankings.sort((a, b) => a.averageRating - b.averageRating);
                const highestRatedPark = parksRankings[0].park;

                setSuggestedPark(highestRatedPark);
                console.log(`Suggested Park: ${highestRatedPark}`);
                toast.success(`Park with the highest rating in the most frequent state: ${highestRatedPark}`);
            } else {
                console.log("No matching parks found in the most frequent state.");
            }

        }
    };
    useEffect(() => {
        if (suggestedPark) {
            fetchParkDetails(suggestedPark);
        }
    }, [suggestedPark]);
    const fetchParkDetails = async (park) => {
        try {
            const response = await fetch(`/api/parks?searchTerm=${park}&searchType=parkClick`);
            if (!response.ok) throw new Error('Failed to fetch park details');

            const data = await response.json();
            const parkDetails = {
                ...data.data[0],
                images: data.data[0].images.slice(0, 3).map(img => ({
                    url: img.url,
                    title: img.title
                })),
                city: data.data[0].addresses[0].city,
                stateCode: data.data[0].addresses[0].stateCode
            };

            setSuggestedParkDetails(parkDetails);
            setParkImages(parkDetails.images);
        } catch (error) {
            console.error('Error fetching park details:', error);
            alert('Fetch Error');
        }
    };

    // Add state for storing users for each common park
    const [userParks, setUserParks] = useState({});
    // useEffect(() => {
    const handleCompare = async () => {
        try {
            const parkCount = {};
            const userParks = {};

            // Count occurrences of each park
            favoritesList.forEach(park => {
                parkCount[park] = (parkCount[park] || 0) + 1;
            });

            // Iterate through each user and fetch their favorite parks
            for (const user of userList) {
                try {
                    const response = await fetch(`/api/favorites/display/${user}`);
                    if (response.ok) {
                        const userFavorites = await response.json();
                        userFavorites.forEach(park => {
                            if (!userParks[park]) userParks[park] = [];
                            userParks[park].push(user);
                        });
                    } else {
                        throw new Error(`Failed to fetch favorites for user ${user}`);
                    }
                } catch (error) {
                    throw new Error(`Error fetching favorites for user ${user}: ${error.message}`);
                }
            }

            const sortedParks = Object.entries(parkCount).sort((a, b) => b[1] - a[1]);

            const commonParkDetails = {};
            // Fetch details for each park
            for (const [park, count] of sortedParks) {
                try {
                    const response = await fetch(`/api/parks?searchTerm=${park}&searchType=parkClick`);
                    if (response.ok) {
                        const data = await response.json();
                        commonParkDetails[park] = data.data[0];
                    } else {
                        throw new Error(`Failed to fetch details for park ${park}`);
                    }
                } catch (error) {
                    console.error(`Error fetching details for park ${park}: ${error.message}`);
                    // You can handle errors here, such as setting commonParkDetails[park] to null or displaying an error message
                }
            }

            setCommonParks(sortedParks);
            setUserParks(userParks);
            setCommonParkDetails(commonParkDetails);
            setTriggerRerender(true); // Trigger re-render after data is fetched
        } catch (error) {
            console.error('Error in handleCompare:', error.message);
            // Handle overall error, display an error message, or set a global error state
        }
    };

    //     handleCompare();
    // }, [commonParkDetails]);


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

                {/* Optional: Display the list of users for suggestions */}
                <div>
                    <h3>Users for Park Suggestions:</h3>
                    <ul>
                        {userList.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                    <Button variant="secondary" onClick={handleCompare}>Compare Parks</Button>
                    {commonParks.map(([park, count]) => (
                        <div key={park}>
                            {commonParkDetails[park] && triggerRerender && (
                                commonParkDetails[park] ? (
                                    <div>
                                        {renderParkInfo(commonParkDetails[park], parkDetails, setParkDetails, "other", updateSearchResults)}
                                    </div>
                                ) : (
                                    <p>Loading...</p>
                                )
                            )}
                            <p>Count: {count}</p>
                            <p>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        // Display users for the clicked park
                                        const users = userParks[park] || []; // Check if userParks[park] exists
                                        alert(`Users who have ${park} in their favorites: ${users.join(", ")}`);
                                    }}
                                >
                                    Ratio: {count / userList.length}
                                </Button>
                            </p>
                        </div>
                    ))}

                    <Button variant="info" onClick={handleSuggest}>Suggest a Park</Button>
                    {/*{suggestedPark && <div>Suggested Park: {suggestedPark}</div>}*/}
                    {suggestedPark && <div>
                        <h4>Suggested Park:</h4>
                        <strong>Location: </strong>{suggestedParkDetails.city}, {suggestedParkDetails.stateCode}
                        {renderParkInfo(suggestedParkDetails, parkDetails, setParkDetails, "other", updateSearchResults)}
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

