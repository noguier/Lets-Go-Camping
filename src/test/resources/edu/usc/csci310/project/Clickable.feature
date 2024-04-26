Feature: test clickable terms

  Scenario: click state code
    Given I am on the search page
    And I click the dropdown Name
    And I enter "Joshua Tree" in the search bar
    And I click the Search button
    And I click on "Joshua Tree National Park" and see details
    When I click on the state code
    Then List of parks such as "Alcatraz Island"

  Scenario: click activity
    Given I am on the search page
    And I click the dropdown Name
    And I enter "Joshua Tree" in the search bar
    And I click the Search button
    And I click on "Joshua Tree National Park" and see details
    When I click on the activity
    Then List of parks such as "Acadia National Park"

  Scenario: click amenity
    Given I am on the search page
    And I click the dropdown Name
    And I enter "Joshua Tree" in the search bar
    And I click the Search button
    And I click on "Joshua Tree National Park" and see details
    When I click on the amenity
    Then List of parks such as "Alcatraz Island"
    