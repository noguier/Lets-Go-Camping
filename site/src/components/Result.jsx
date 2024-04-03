import React from "react";

const renderParkInfo = (park, parkDetails, setParkDetails) => {
    if (parkDetails && parkDetails.fullName === park.fullName) {
        return (
            <div>
                <h3><a href="{parkDetails.url}" target="_blank">{parkDetails.fullName}</a></h3>
                <p>
                    <strong>Location:</strong> {parkDetails.addresses[0].city}, {parkDetails.addresses[0].stateCode}
                </p>
                <div>
                    {/*/!*{console.log(parkDetails.entranceFees[0].cost)}*!/*/}
                    {/*<p><strong>Entrance Fee:</strong> ${parkDetails.entranceFees[0].cost}</p>*/}
                    {/*<p>{parkDetails.entranceFees[0].description}</p>*/}
                    {parkDetails && parkDetails.entranceFees && parkDetails.entranceFees.length > 0 ? (
                        <div>
                            <p><strong>Entrance Fee:</strong> ${parkDetails.entranceFees[0].cost}</p>
                            <p> Entrance Fee Description: {parkDetails.entranceFees[0].description}</p>
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
                <div className="favorite-button">
                    <button type="submit" className="btn btn-favorite">Favorites+</button>
                </div>
                <img src={parkDetails.images[0].url} alt={parkDetails.images[0].altText}
                     style={{maxWidth: "40%", height: "auto"}}
                     title={parkDetails.images[0].title}/>
                <hr/>
            </div>
        );
    } else {
        return (
            <button id="expand" onClick={() => handleParkClick(park.parkCode, setParkDetails)}>
                <strong>Park Name:</strong> {park.fullName}
            </button>
        );
    }
};

const handleParkClick = (parkCode, setParkDetails) => {
    //switch to backend
    let apiUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&limit=1&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            setParkDetails(data.data[0]);
            console.log(data.data);
            // console.log("printing out search results array", searchResults);


        })
        .catch(error => {
            alert('Fetch Error');
            console.error(error);
        });


};

export { renderParkInfo, handleParkClick };
