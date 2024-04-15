Feature: Test search functionality
  Scenario: Perform Search based on park name
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Castle Mountains National Monument"

  Scenario: Perform Search based on park location, two letters

    Given I am on the search page
    And I click the dropdown State
    When I enter "CA" in the search bar
    And I click the Search button
    Then List of parks such as "Butterfield Overland National Historic Trail"

#  Scenario: Perform Search based on park state, but wrong input
#    Given I am on the search page
#    And I click the dropdown State
#    When I enter "California" in the search bar
#    And I click the Search button
#    Then I should see 0 park items displayed

  Scenario: Perform Search with no input
    Given I am on the search page
    When I enter "" in the search bar
    And I click the Search button
    Then I should get an error message "Please enter your search term"

  Scenario: Perform Search based on park Amenities
    Given I am on the search page
    And I click the dropdown amenities
    When I enter "ATM" in the search bar
    And I click the Search button
    Then List of parks such as "Big Bend National Park"

  Scenario: Perform Search based on park Activity
    Given I am on the search page
    And I click the dropdown Activity
    When I enter "Swimming" in the search bar
    And I click the Search button
    Then List of parks such as "Acadia National Park"

  Scenario: Perform Search based on default Park Name
    Given I am on the search page
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Castle Mountains National Monument"

  Scenario: Search with enter key
    Given I am on the search page
    When I enter "Joshua" in the search bar
    And I press enter
    Then List of parks such as "Castle Mountains National Monument"


  Scenario: Perform Search and see details
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Joshua Tree National Park"
    And I click on "Joshua Tree National Park" and see details
    Then I see Location state "Twentynine Palms"
    Then I see "$30.00"
    Then I see "7-day vehicle permit"
    Then I see "Two distinct desert ecosystems,"
    Then I see "Automated External Defibrillator (AED)"
    Then I see "Auto and ATV"
    Then I see "The sky turns hues"
    Then I click URL
    Then tab opened should be "https://www.nps.gov/jotr/index.htm"

  Scenario: non-expanded plus button, park not already in favorites
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Joshua Tree National Park"
    And I hover over "Joshua Tree National Park" container
    Then I click the plus button
    Then I should get an alert saying "Added to favorites!"

  Scenario: expanded plus button, park not already in favorites
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Joshua Tree National Park"
    And I click on "Joshua Tree National Park" and see details
    Then I should not see "In Favorites List"
    Then I click the plus button
    Then I should get an alert saying "Added to favorites!"

  Scenario: park already in favorites
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then List of parks such as "Joshua Tree National Park"
    And "Joshua Tree National Park" is already in my favorites
    When I click on "Joshua Tree National Park" and see details
    Then I wait a little
    #timing issue
    Then I see "In Favorites List"
    Then I click the plus button
    Then I should get an alert saying "This Park was already added to favorites"

  Scenario: Perform Search by Name and choose Load More
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Park" in the search bar
    And I click the Search button
    Then List of parks such as "Acadia National Park"
    And I click the Load More button
    Then List of parks such as "Amache National Historic Site"

  Scenario: Perform Search by State and choose Load More
    Given I am on the search page
    And I click the dropdown State
    When I enter "CA" in the search bar
    And I click the Search button
    Then List of parks such as "Butterfield Overland National Historic Trail"
    And I click the Load More button
    Then List of parks such as "Golden Gate National Recreation Area"

  Scenario: Perform Search by Activity and choose Load More
    Given I am on the search page
    And I click the dropdown Activity
    When I enter "Swimming" in the search bar
    And I click the Search button
    Then List of parks such as "Acadia National Park"
    And I click the Load More button for Activity
    Then List of parks such as "Cape Lookout National Seashore"

  Scenario: Perform Search by Amenity and choose Load More
    Given I am on the search page
    And I click the dropdown amenities
    When I enter "Braille" in the search bar
    And I click the Search button
    Then List of parks such as "Acadia National Park"
    And I click the Load More button for Amenity
    Then List of parks such as "Grand Canyon National Park"

  Scenario: Perform Search and choose Load More 2 more times
    Given I am on the search page
    And I click the dropdown Activity
    When I enter "Swimming" in the search bar
    And I click the Search button
    Then List of parks such as "Acadia National Park"
    And I click the Load More button for Activity
    And I click the Load More button Again for Activity
    Then List of parks such as "Cape Lookout National Seashore"

#  Scenario: Perform Search and show at least 10 items
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    Then I should get a list of parks such as "Josh"
#    Then I should see 10 park items displayed

#  Scenario: Perform Search and see Inline description
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    Then I should get a list of parks such as "Josh"//need to fix
#    Then I hover over the "Yellowstone National Park" and see search description