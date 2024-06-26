Feature: test navigation functionality
  Scenario: Navigate to Favorites from Search
    Given I am on the search page
    When I click the Favorites button
    Then I should be redirected to the Favorites page

  Scenario: Navigate to Compare and Suggest from Search
    Given I am on the search page
    And I click Compare and Suggest button
    Then I should be redirected to the Compare and Suggest page

  Scenario: Navigate to Login page from Search
    Given I am on the search page
    And I click Logout button
    Then I should be redirected to the login page

  Scenario: Navigate to Search from Favorites
    Given I am on the Favorites page
    And I click Search button
    Then I should be redirected to the Search page

  Scenario: Navigate to Compare and Suggest from Favorites
    Given I am on the Favorites page
    And I click Compare and Suggest button
    Then I should be redirected to the Compare and Suggest page

  Scenario: Navigate to Login page from Favorites
    Given I am on the Favorites page
    And I click Logout button
    Then I should be redirected to the login page

  Scenario: Navigate to Search from Compare and Suggest
    Given I am on the Compare and Suggest page
    And I click Search button
    Then I should be redirected to the Search page

  Scenario: Navigate to Favorites from Compare and Suggest
    Given I am on the Compare and Suggest page
    When I click the Favorites button
    Then I should be redirected to the Favorites page

  Scenario: Navigate to Login from Compare and Suggest
    Given I am on the Compare and Suggest page
    And I click Logout button
    Then I should be redirected to the login page