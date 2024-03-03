import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchTerm.trim() === '') {
            alert('Please enter your search term');
            return;
        }

        let apiUrl = '';

        if (searchType === 'name') {
            apiUrl = `https://developer.nps.gov/api/v1/parks?q=${searchTerm}&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
        } else if (searchType === 'state') {
            apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${searchTerm}&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
        } else if (searchType === 'activity') {
            apiUrl = `https://developer.nps.gov/api/v1/activities/parks?q=${searchTerm}&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
        } else if (searchType === 'amenity') {
            apiUrl = `https://developer.nps.gov/api/v1/amenities/parksplaces?q=${searchTerm}&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data.data);
            })
            .catch(error => {
                alert('Fetch Error');
                console.error(error);
            });
    };

    return (
        <div className="container">
            <div className="row">
                <h1 className="col-12 mt-4">Search Parks</h1>
            </div>

            <div className="row">
                <form className="col-12" onSubmit={handleSearch}>
                    <div className="form-row">
                        <div className="col-10 mt-4 col-sm-6 col-lg-4">
                            <label htmlFor="search-term" className="sr-only">Search:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="search-term"
                                placeholder={searchType === 'name' ? 'Enter park name' :
                                    searchType === 'state' ? 'Enter 2-letter state code' :
                                        searchType === 'activity' ? 'Enter activity' :
                                            'Enter amenity'
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <small id="error" className="form-text text-danger"></small>
                        </div>
                        <div className="col-2 mt-4 col-sm-auto">
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </div>
                    <div className="form-row mt-3">
                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="searchByName"
                                    value="name"
                                    checked={searchType === 'name'}
                                    onChange={() => setSearchType('name')}
                                />
                                <label className="form-check-label" htmlFor="searchByName">
                                    Search by Name
                                </label>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="searchByState"
                                    value="state"
                                    checked={searchType === 'state'}
                                    onChange={() => setSearchType('state')}
                                />
                                <label className="form-check-label" htmlFor="searchByState">
                                    Search by State
                                </label>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="searchByActivity"
                                    value="activity"
                                    checked={searchType === 'activity'}
                                    onChange={() => setSearchType('activity')}
                                />
                                <label className="form-check-label" htmlFor="searchByActivity">
                                    Search by Activity
                                </label>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="searchType"
                                    id="searchByAmenity"
                                    value="amenity"
                                    checked={searchType === 'amenity'}
                                    onChange={() => setSearchType('amenity')}
                                />
                                <label className="form-check-label" htmlFor="searchByAmenity">
                                    Search by Amenity
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="row">
                <div id="park-results" className="col-12 mt-4">
                    Showing <span className="font-weight-bold">{searchResults.length}</span> result(s).
                </div>
            </div>

            {searchType === 'activity'  && (
                <div className="row mt-4">
                    {searchResults.map((result, index) => (
                        <div key={index} className="col-12">
                            {result.name && <h3>{result.name}</h3>}
                            {result.parks && (
                                <div>
                                    {result.parks.map((park, parkIndex) => (
                                        <li key={parkIndex}>{park.name}</li>
                                    ))}
                                </div>
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
            )}


            {searchType !== 'activity' && (
                <div className="row mt-4">
                    {searchResults.map((park, index) => (
                        <div key={index} className="col-12">
                            <h3>{park.name}</h3>
                            <p><strong>Description:</strong> {park.description}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Search;
