Feature: test suggest a park functionality
#  Scenario: suggest a park for two users
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And I click add a user button
#    And That user has a public list of favorites
#    And I see "User sucessfully added" displayed on the page
#    And I click compare button
#    Then I should see the information about one park that is on Favorite list of both users
#
#  Scenario: suggest a park for a user with private Favorites list
#    Given I am on the suggest a park page
#    When I enter a username "BillyBruin"
#    And I click add a user button
#    And That user doesn't have a public list of favorites
#    Then I should see "This user doesnt have a public Favorites List" displayed on the page
#
#  Scenario: suggest a park for three users
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And I click add a user button
#    And That user has a public list of favorites
#    And I see "User sucessfully added" displayed on the page
#    And I enter username "TallyTrojan"
#    And I click add a user button
#    And That user has a public list of favorites
#    And I see "User sucessfully added" displayed on the page
#    And I click compare button
#    Then I should see the information about one park that is on Favorite list of all users
#
#  Scenario: suggest a park for users with more than 1 match
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And I click add a user button
#    And That user has a public list of favorites
#    And I see "User sucessfully added" displayed on the page
#    And I enter username "TallyTrojan"
#    And I click add a user button
#    And That user has a public list of favorites
#    And I see "User sucessfully added" displayed on the page
#    And I click compare button
#    And There are more than one park that are on all the users' favorite pages
#    Then I should see the information about one park that is on Favorite list of all users with the highest average ranking
#
#  Scenario: suggest a park for a user that doesn't exist
#    Given I am on the suggest a park page
#    When I enter a username "NotAUser"
#    And I click add a user button
#    And that user doesnt exist in the database
#    Then I should see "The User doesn't exist" displayed on the page