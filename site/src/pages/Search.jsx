import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {renderParkInfo} from "../components/Result";
import axios from 'axios';
import Header from "../components/Header";

const Search = ({ updateAuthenticationStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsAmenity, setSearchResultsAmenity] = useState([]);
    const [parkDetails, setParkDetails] = useState(null);

    const [resultsToShow, setResultsToShow] = useState(10); // Track number of results to show

    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();

        if (searchTerm.trim() === '') {
            alert('Please enter your search term');
            return;
        }

        try {
            const encodedSearchTerm = encodeURIComponent(searchTerm);
            const response = await fetch(`/api/parks?searchTerm=${encodedSearchTerm}&searchType=${searchType}`);
            const data = await response.json();

            if (searchType === 'amenity') {
                setSearchResultsAmenity(data.data);
            } else {
                setSearchResults(data.data);
            }
            const parkCodes = data.data.map(park => park.parkCode);
            console.log(data.data)
            // Reset results to show to 10 when new search is performed
            setResultsToShow(10);

        } catch (error) {
            alert('Fetch Error');
            console.error(error);
        }

    };

    const loadMoreResults = () => {
        // Increment the number of results to show by 10
        setResultsToShow(resultsToShow + 10);
    };


// Function to handle logout
// const handleLogout = async () => {
//     try {
//         await axios.post('/api/users/logout');
//         updateAuthenticationStatus(false);
//         navigate('/login');
//     } catch (error) {
//     console.error('Logout error:', error);
//     }
// };




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

    {/* Display search results and Load More button */}
    {/*     for search by name and by state */}
    {searchResults.length > 0 && (
      <>
        {/* Display first 'resultsToShow' results */}
        {searchResults.slice(0, resultsToShow).map((park, index) => (
          <div tabIndex={0} key={index} className="col-12">
            {renderParkInfo(park, parkDetails, setParkDetails, 'search')}
            <hr />
          </div>
        ))}

        {/* Display Load More button if there are more results to show */}
        {searchResults.length > resultsToShow && (
          <div className="row mt-4">
            <div className="col-12">
              <button className="btn btn-primary" onClick={loadMoreResults}>
                Load More
              </button>
            </div>
          </div>
        )}
      </>
    )}

        {/* Display search results and Load More button for search by activity */}
            {searchType === 'activity' && (
                <div className="row mt-4">
                    {searchResults.map((activity, index) => (
                        <div key={index} className="col-12">
                            {activity.parks && (
                                <div>
                                    {activity.parks.slice(0, resultsToShow).map((park, parkIndex) => (
                                        <div tabIndex={0} key={parkIndex}>
                                            <h3>{park.fullName}</h3>
                                            <p><strong>Activity:</strong> {activity.name}</p>
                                            <hr />
                                        </div>
                                    ))}
                                    {/* Display Load More button if there are more results to show */}
                                    {activity.parks.length > resultsToShow && (
                                        <div className="row mt-4">
                                            <div className="col-12">
                                                <button className="btn btn-primary" onClick={loadMoreResults}>
                                                    Load More
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

{searchType === 'amenity' && (
    <div className="row mt-4">
        {searchResultsAmenity.map((amenityArray, index) => (
            <div   key={index} className="col-12">
                {amenityArray.map((amenity, innerIndex) => (
                    <div key={innerIndex}>
                        <h3>{amenity.name}</h3>
                        {amenity.parks.slice(0, resultsToShow).map((park, parkIndex) => (
                            <div  tabIndex={0} key={parkIndex}>
                                <p><strong>Park Name:</strong> {park.fullName}</p>
                                <hr />
                            </div>
                        ))}
                        {/* Display Load More button if there are more results to show */}
                        {amenity.parks.length > resultsToShow && (
                            <div className="row mt-4">
                                <div className="col-12">
                                    <button className="btn btn-primary" onClick={loadMoreResults}>
                                        Load More
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ))}
    </div>
)}

  </div>
);
}

export default Search;