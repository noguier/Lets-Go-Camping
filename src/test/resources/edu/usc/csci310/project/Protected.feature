Feature: test the login functionality of the user session management

  Scenario: unauthenticated user wants to navigate to create account page
    Given I am on the login page
    When I click on the Don't have account button
    Then I should be redirected to the Create Account page

  Scenario: unauthenticated user tries to go to protected search page
    Given I am on the login page
    And I am not an authenticated user
    When I try to go to the search page
    Then I should be redirected to the login page

  Scenario: unauthenticated user becomes authenticated and goes to search page
    Given I am on the login page
    And Tommy is a registered user
    When I enter the username "Tommy"
    And I enter the password "Trojan123"
    And I click the login button
    Then I should be redirected to the Dashboard page

  Scenario: authenticated user tries to go to protected favorites page
    Given I am an authenticated user
    And I am on the search page
    When I click the Go to Favorites button
    Then I should be redirected to the Favorites page

  Scenario: authenticated user logouts and becomes unauthenticated
    Given I am an authenticated user
    And I am on the search page
    When I click the Logout button
    Then I should be redirected to the login page
