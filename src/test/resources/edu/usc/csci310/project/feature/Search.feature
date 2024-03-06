Feature: Test search functionality
  Scenario: Perform Search based on park name
    Given I am on the search page
    And I click the dropdown Name
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then I should get a list of parks such as "Castle Mountains National Monument"


  Scenario: Perform Search based on park location, two letters

    Given I am on the search page
    And I click the dropdown State
    When I enter "CA" in the search bar
    And I click the Search button
    Then I should get a list of parks such as "Butterfield Overland National Historic Trail"


  Scenario: Perform Search based on park state, but wrong input
    Given I am on the search page
    And I click the dropdown State
    When I enter "California" in the search bar
    And I click the Search button
    Then I should see 0 park items displayed


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
    Then I should get a list of parks such as "Big Bend National Park"


  Scenario: Perform Search based on park Activity
    Given I am on the search page
    And I click the dropdown Activity
    When I enter "Swimming" in the search bar
    And I click the Search button
    Then I should get a list of parks such as "Acadia National Park"


  Scenario: Perform Search based on default Park Name
    Given I am on the search page
    When I enter "Joshua" in the search bar
    And I click the Search button
    Then I should get a list of parks such as "Castle Mountains National Monument"


#  Scenario: Perform Search and show at least 10 items
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    Then I should get a list of parks such as "Josh"
#    Then I should see 10 park items displayed


#  Scenario: Perform Search and choose Load More
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    Then I should get a list of parks such as "Josh" //need to fix
#    And I should see 10 park items displayed
#    And I click the Load More button
#    Then I should see 20 park items displayed


#  Scenario: Perform Search and choose Load More 2 more times
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    And I click the Load More button two more times
#    Then I should see 30 park items displayed


#  Scenario: Perform Search and see Inline description
#    Given I am on the search page
#    And I click the dropdown Name
#    When I enter "Yellowstone" in the search bar
#    And I click the Search button
#    Then I should get a list of parks such as "Josh"//need to fix
#    Then I hover over the "Yellowstone National Park" and see search description

