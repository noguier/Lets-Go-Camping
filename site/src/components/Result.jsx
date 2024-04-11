import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import toast from "react-hot-toast";
import Search from "../pages/Search";
const ParkDetails = ({ park, parkDetails, setParkDetails, page, updateSearchResults}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [amenityResults, setAmenityResults] = useState([]);
    const [showPlusButton, setShowPlusButton] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);


    const handleStateCodeClick = async (stateCode) => {
        try {
            console.log(stateCode)
            const response = await fetch(`/api/parks?searchTerm=${stateCode}&searchType=state`);
            console.log(response)
            const data = await response.json();
            console.log(typeof updateSearchResults);
            updateSearchResults(data.data, 'state'); // Call the callback function to update search results

        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };

    const handleActivityClick = async (activityName) => {
        try {
            console.log(activityName)
            const response = await fetch(`/api/parks?searchTerm=${activityName}&searchType=activity`);
            console.log(response)
            const data = await response.json();
            updateSearchResults(data.data, 'activity');
        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }
    };


    const handleAmenityClick = async (amenityName) => {
        try {
            console.log(amenityName)
            const response = await fetch(`/api/parks?searchTerm=${amenityName}&searchType=amenity`);
            console.log(response)
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
            console.log(inFavorites);
        } catch (error) {
            // console.log("ERROR.:" + error.response.data);
            toast.error("This Park was already added to favorites");
            // if (error.response && error.response.status === 400) {
            //     console.log("ERROR.:" + error.response.data);
            //     alert("This Park was already added to favorites");
            // } else {
            //     console.log("ERROR FAILED.:" + error.response.data.message);
            //     console.error('Error adding to favorites:', error);
            // }
        }
    };
//use this as the fetch request for remove
    // const removeFromFavorites = async (parkCode) => {
    //     // Add logic to add to favorites list
    //     try {
    //         console.log("Starting to a try to remove to fav");
    //         // console.log("ParkCode:", parkCode);//debugging, doesn't work with not expanded view
    //         await axios.post('/api/favorites/remove', parkCode);
    //         console.log("removed from favorites.");
    //         alert('Removed to favorites!');
    //
    //     } catch (error) {
    //         console.log("ERROR FAILED.:" + error.response.data.message);
    //         console.error('Error removing from favorites:', error);
    //
    //     }
    // };


    if (parkDetails && parkDetails.fullName === park.fullName) {
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
                            onClick={() => addToFavorites(park.parkCode)} // this does not work when adding to favorites
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                        </a>
                    )}
                </div>
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

                            onClick={() => addToFavorites(parkDetails.parkCode)}

                        >
                            <FontAwesomeIcon icon={faPlus}/>
                        </a>
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
                        onClick={() => addToFavorites(park.parkCode)}
                    >
                        <FontAwesomeIcon icon={faPlus}/>
                    </a>
                )}
            </div>
        );
    }
};

const renderParkInfo = (park, parkDetails, setParkDetails, page, updateSearchResults) => {
    return <ParkDetails park={park} parkDetails={parkDetails} setParkDetails={setParkDetails} page={page} updateSearchResults={updateSearchResults}/>;
};

export { renderParkInfo };
