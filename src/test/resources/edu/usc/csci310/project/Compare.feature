Feature: test compare a park functionality
#  Scenario: compare a park for two users
#    Given I am on the compare a park page
#    When I enter a username "TommyTrojan"
#    And that user has a public list of favorites
#    Then I should see the all the parks that are on Favorite list of at least one user
#
#  Scenario: compare a for a user with private Favorites list
#    Given I am on the compare a park page
#    When I enter a username "BillyBruin"
#    And That user has a private list of favorites
#    Then I should see "This user doesnt have a public Favorites List" displayed on the page
#
##    two people out of three like joshua tree then it should displayed "liked by 2 out of 3"
#  Scenario: compare a park for three users
#    Given I am on the compare a park page
#    When I enter a username "TommyTrojan"
#    And I enter username "TallyTrojan"
#    And those users have a public list of favorites
#    Then I should see the all the parks that are on Favorite list of at least one user
#    And I should see the ratio of how many users like a specific park for each park
#
#  Scenario: compare a park for three users and see which user like that park
#    Given I am on the compare a park page
#    When I enter a username "TommyTrojan"
#    And I enter username "TallyTrojan"
#    And those users have a public list of favorites
#    Then I should see the all the parks that are on Favorite list of at least one user
#    And I should see the ratio of how many users like a specific park for each park
#    When I hover over the ratio
#    Then I should see the users that liked that park
#
#  Scenario: compare a park for a user that doesn't exist
#    Given I am on the compare a park page
#    When I enter a username "NotAUser"
#    And that user doesnt exist in the database
#    Then I should see "The User doesn't exist" displayed on the page