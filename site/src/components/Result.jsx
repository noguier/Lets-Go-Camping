import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
const ParkDetails = ({ park, parkDetails, setParkDetails, page, updateSearchResults}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [amenityResults, setAmenityResults] = useState([]);
    const [showPlusButton, setShowPlusButton] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);
    const isFavoritesPage = page === "favorites";
    const isOtherPage = page === "other";

    useEffect(() => {
        console.log("park details use effect", parkDetails)
    }, [parkDetails]);



    const handleStateCodeClick = async (stateCode) => {
        try {
            // console.log(stateCode)
            const response = await fetch(`/api/parks?searchTerm=${stateCode}&searchType=state`);
            // console.log(response)
            const data = await response.json();
            // console.log(typeof updateSearchResults);
            updateSearchResults(data.data, 'state'); // Call the callback function to update search results

        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };

    const handleActivityClick = async (activityName) => {
        try {
            // console.log(activityName)
            const response = await fetch(`/api/parks?searchTerm=${activityName}&searchType=activity`);
            // console.log(response)
            const data = await response.json();
            updateSearchResults(data.data, 'activity');
        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };


    const handleAmenityClick = async (amenityName) => {
        try {
            // console.log(amenityName)
            const response = await fetch(`/api/parks?searchTerm=${amenityName}&searchType=amenity`);
            // console.log(response)
            const data = await response.json();
            updateSearchResults(data.data, 'amenity');
        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };


    const handleToggleDetails = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            setShowPlusButton(false); // show the plus button when expanded
        } else {
            setIsExpanded(false);
            setShowPlusButton(true); // hide the plus button when not expanded
        }
    };

    const handleMouseEnter = () => {
        setShowPlusButton(true);
    };

    const handleMouseLeave = () => {
        setShowPlusButton(false);
    };
    const populateAmenities = async (parkCode) => {
        try {
            const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=amenity_parkcode`);
            const data = await response.json();
            setAmenityResults(data.data);
        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };

    const handleParkClick = async (parkCode, setParkDetails) => {
        console.log("RESULT: Clicked park:", parkCode); // Log the clicked park code
        try {
            const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=parkClick`);
            const data = await response.json();
            console.log("RESULT: Response from fetchParkDetails:", data.data[0]); // Log the response data
            setParkDetails(data.data[0]); // Update parkDetails state
            console.log("PARK DETAILS: ", parkDetails)
        } catch (error) {
            console.error('Error fetching park details:', error);
            alert('Fetch Error');
        }
        await populateAmenities(parkCode);
    };

    const addToFavorites = async (parkCode) => {
        // Add logic to add to favorites list
        try {
            // console.log("Starting to a try to add to fav");
            // console.log("parkCode", parkCode);
            // console.log("ParkCode:", parkCode);//debugging, doesn't work with not expanded view
            await axios.post('/api/favorites/add', parkCode);
            // console.log("Added to favorites.");
            toast.success('Added to favorites!');
            setInFavorites(true);

            // console.log(inFavorites);
            console.log("IN FAVORITES");
        } catch (error) {
            // console.log("ERROR.:" + error.response.data);
            toast.error("This Park was already added to favorites");
        }
    };
    const removeFromFavorites = async (parkCode) => {

        try {
            if (confirm("Remove this park from your favorites list?") === true){
                await axios.post('/api/favorites/remove', parkCode);
                toast.success('Removed from favorites!');
                setInFavorites(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };
    if (parkDetails && parkDetails.fullName === park.fullName) {
    // if (parkDetails ) {///use this if statement to debug

        return (
            <div>
                <div data-testid={"list-element-toggle"} id="expand1" onMouseLeave={handleMouseLeave}
                     onClick={handleToggleDetails}>
                    <h3
                        onClick={() => handleParkClick(park.parkCode, setParkDetails)}
                        tabIndex="0" // Make the <h3> focusable
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleParkClick(park.parkCode, setParkDetails);
                                handleToggleDetails();
                            }
                        }}
                    >
                        {park.fullName}
                    </h3>
                    {!isOtherPage && showPlusButton && !isExpanded &&(
                        <a
                            href="#"
                            id="plus"
                            data-testid={"plus-button"}
                            style={{
                                position: "relative",
                                top: "0px",
                                right: "0px",
                            }}
                            onClick={() => {
                                if (isFavoritesPage) {
                                    removeFromFavorites(park.parkCode);
                                } else {
                                    addToFavorites(park.parkCode);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={isFavoritesPage ? faMinus : faPlus} />
                        </a>
                    )}
                </div>
                {/*{isFavoritesPage && ( // Render button only if on Favorites page*/}
                {/*    <button onClick={() => removeFromFavorites(park.parkCode)}>Remove from Favorites</button>*/}
                {/*)}*/}
                {isExpanded && (
                    <div>
                        { !isOtherPage && (
                            <a
                                href="#"
                                id="plus"
                                data-testid={"plus-button"}
                                style={{
                                    position: "relative",
                                    top: "0px",
                                    right: "0px",
                                }}
                                onClick={() => {
                                    if (isFavoritesPage) {
                                        removeFromFavorites(parkDetails.parkCode);
                                    } else {
                                        addToFavorites(parkDetails.parkCode);
                                    }
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={isFavoritesPage ? faMinus : faPlus}/> {/* Render minus icon if on favorites page */}
                            </a>
                        )}
                        <h3><a id="url" href={parkDetails.url} target="_blank">Website</a></h3>
                        <p>
                            {/*<strong>Location:</strong> {parkDetails.addresses[0].city}, {parkDetails.addresses[0].stateCode}*/}
                            <strong>Location:</strong> {parkDetails.addresses[0].city},
                            <a
                                style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                                onClick={() => handleStateCodeClick(parkDetails.addresses[0].stateCode)}
                                onMouseEnter={(e) => {
                                    e.target.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.textDecoration = 'none';
                                }}
                            >
                                {parkDetails.addresses[0].stateCode}
                            </a>

                        </p>
                        <div>
                            {parkDetails && parkDetails.entranceFees && parkDetails.entranceFees.length > 0 ? (
                                <div>
                                    <p><strong>Entrance Fee:</strong> ${parkDetails.entranceFees[0].cost}</p>
                                    <p>Entrance Fee Description: {parkDetails.entranceFees[0].description}</p>
                                </div>
                            ) : (
                                <div>
                                    <p><strong>Entrance Fee:</strong> NA</p>
                                </div>
                            )}
                        </div>
                        <p>
                            <strong>Description:</strong> {parkDetails.description}
                        </p>
                        <div>
                            <strong>Activities:</strong>
                            <ul>
                                {parkDetails.activities.map((activity, index) => (
                                    <li key={index}>{


                                        <a
                                            style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                                            onClick={() => handleActivityClick(activity.name)}
                                            onMouseEnter={(e) => {
                                                e.target.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.textDecoration = 'none';
                                            }}
                                        >
                                            {activity.name}
                                        </a>


                                    }</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Amenities:</strong>
                            <ul>
                                {amenityResults.length > 0 ?
                                    amenityResults.map(entry => <li key={entry[0].id}>


                                        <a
                                            style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                                            onClick={() => handleAmenityClick(entry[0].name)}
                                            onMouseEnter={(e) => {
                                                e.target.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.textDecoration = 'none';
                                            }}
                                        >
                                            {entry[0].name}
                                        </a>

                                    </li>)
                                    :
                                    <li>NA</li>
                                }
                            </ul>

                        </div>
                        <div>
                            {(page === "search" && inFavorites && isExpanded) ?
                                <p id="inFav">In Favorites List</p> : null} {/* Conditionally render based on inFavorites state */}
                        </div>
                        <img src={parkDetails.images[0].url} alt={parkDetails.images[0].altText}
                             style={{maxWidth: "40%", height: "auto"}}
                             title={parkDetails.images[0].title}/>
                    </div>
                )}
            </div>



        );
    } else {
        return (
            <div data-testid={"list-element-toggle"} id="expand" onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 onClick={handleToggleDetails}>
                <h3
                    onClick={() => handleParkClick(park.parkCode, setParkDetails)}
                    tabIndex="0" // Make the <h3> focusable
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleParkClick(park.parkCode, setParkDetails);
                            handleToggleDetails();
                        }
                    }}
                >
                    {park.fullName}
                </h3>
                {showPlusButton && !isOtherPage && (
                    <a
                        href="#"
                        id="plus"
                        data-testid={"plus-button"}
                        style={{
                            position: "relative",
                            top: "0px",
                            right: "0px",
                        }}
                        onClick={() => {
                            if (isFavoritesPage) {
                                removeFromFavorites(park.parkCode);
                            } else {
                                addToFavorites(park.parkCode);
                            }
                        }}
                    >
                        <FontAwesomeIcon icon={isFavoritesPage ? faMinus : faPlus} />
                    </a>
                )}
            </div>
        );
    }
};

const renderParkInfo = (park, parkDetails, setParkDetails, page, updateSearchResults) => {
    console.log("Park details:", parkDetails);
    return <ParkDetails
        park={park}
        parkDetails={parkDetails}
        setParkDetails={setParkDetails}
        page={page}
        updateSearchResults={updateSearchResults}/>;
};

export {renderParkInfo};
