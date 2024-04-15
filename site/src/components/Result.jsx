import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import toast from "react-hot-toast";
import {useState} from "react";

const ParkDetails =  ({park, parkDetails, setParkDetails, page}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [amenityResults, setAmenityResults] = useState([]);
    const [showPlusButton, setShowPlusButton] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);
    const isFavoritesPage = page === "favorites";
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
        } catch (error) {
            console.error('RESULTError fetching park details:', error);
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
            await axios.post('/api/favorites/remove', parkCode);
            toast.success('Removed from favorites!');
            setInFavorites(false);
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    if (parkDetails && parkDetails.fullName === park.fullName) {
    // if (parkDetails ) {///use this if statement to debug
        return (
            <div>
                <div data-testid={"list-element-toggle"} id="expand1" onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                     onClick={handleToggleDetails}>
                    <h3 onClick={() => handleParkClick(park.parkCode, setParkDetails)}>{park.fullName}</h3>
                    {showPlusButton && !isExpanded && (
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
                            <FontAwesomeIcon icon={isFavoritesPage ? faMinus : faPlus} /> {/* Render minus icon if on favorites page */}
                        </a>
                        <h3><a id="url" href={parkDetails.url} target="_blank">Website</a></h3>
                        <p>
                            <strong>Location:</strong> {parkDetails.addresses[0].city}, {parkDetails.addresses[0].stateCode}
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
                                    <li key={index}>{activity.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <strong>Amenities:</strong>
                            <ul>
                                {amenityResults.length > 0 ?
                                    amenityResults.map(entry => <li key={entry[0].id}>{entry[0].name}</li>)
                                    :
                                    <li>NA</li>
                                }
                            </ul>

                        </div>
                        <div>
                            {(page === "search" && inFavorites && isExpanded) ?
                                <p>In Favorites List</p> : null} {/* Conditionally render based on inFavorites state */}
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
                <h3 onClick={() => handleParkClick(park.parkCode, setParkDetails)}>{park.fullName}</h3>
                {showPlusButton && (
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

const renderParkInfo = (park, parkDetails, setParkDetails, page) => {
    console.log("Park details:", parkDetails);

    return <ParkDetails
        park={park}
        parkDetails={parkDetails}
        setParkDetails={setParkDetails}
        page={page}/>;
};

export {renderParkInfo};
