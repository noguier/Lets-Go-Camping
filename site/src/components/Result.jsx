import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ParkDetails = ({ park, parkDetails, setParkDetails, page }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [amenityResults, setAmenityResults] = useState([]);
    const [showPlusButton, setShowPlusButton] = useState(false);
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
        //switch to backend
        try {
            const response = await fetch(`/api/parks?searchTerm=${parkCode}&searchType=parkClick`);
            const data = await response.json();
            setParkDetails(data.data[0]);

        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
        await populateAmenities(parkCode)
    };
    const addToFavorites = () => {
        // Add logic to add to favorites list
        console.log("Added to favorites!");
    };
    const inFavoritesList = () => {
        return <p>Added to favorites list</p>;
    }

    if (parkDetails && parkDetails.fullName === park.fullName) {
        return (
            <div>
                <div data-testid={"list-element-toggle"} id="expand1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                     onClick={handleToggleDetails}>
                    <h3 onClick={() => handleParkClick(park.parkCode, setParkDetails)}>{park.fullName}</h3>
                    {showPlusButton && !isExpanded && (
                        <a
                            href="#"
                            data-testid={"plus-button"}
                            style={{
                                position: "relative",
                                top: "0px",
                                right: "0px",
                            }}
                            onClick={addToFavorites}
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                        </a>
                    )}
                </div>
                {isExpanded && (
                    <div>
                        <a
                            href="#"
                            data-testid={"plus-button"}
                            style={{
                                position: "relative",
                                top: "0px",
                                right: "0px",
                            }}
                            onClick={addToFavorites}
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                        </a>
                        <h3><a href={parkDetails.url} target="_blank">Website</a></h3>
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
                        {/*<div className="favorite-button">*/}
                        {/*    <button type="submit" className="btn btn-favorite">Favorites+</button>*/}
                        {/*</div>*/}
                        <div>
                            {page === 'search' && inFavoritesList()}
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
            <div data-testid={"list-element-toggle"} id="expand" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                 onClick={handleToggleDetails}>
                <h3 onClick={() => handleParkClick(park.parkCode, setParkDetails)}>{park.fullName}</h3>
                {showPlusButton && (
                    <a
                        href="#"
                        data-testid={"plus-button"}
                        style={{
                            position: "relative",
                            top: "0px",
                            right: "0px",
                        }}
                        onClick={addToFavorites}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </a>
                    )}
            </div>
        );
    }
};

const renderParkInfo = (park, parkDetails, setParkDetails, page) => {
    return <ParkDetails park={park} parkDetails={parkDetails} setParkDetails={setParkDetails} page={page}/>;
};

export {renderParkInfo};
