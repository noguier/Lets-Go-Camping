#Feature: test suggest a park functionality
#  Scenario: suggest a park for two users
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And that user has a public list of favorites
#    Then I should see the park information that is on Favorite list of both users
#
#  Scenario: suggest a for a user with private Favorites list
#    Given I am on the suggest a park page
#    When I enter a username "BillyBruin"
#    And That user has a private list of favorites
#    Then I should see "This user doesnt have a public Favorites List" displayed on the page
#
#  Scenario: suggest a park for three users
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And I enter username "TallyTrojan"
#    And those users have a public list of favorites
#    Then I should see the park information that is on everyone Favorite list
#
#  Scenario: suggest a park for a user with more than 1 match
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And that user has a public list of favorites
#    And there are more than one park that are on both of those users lists
#    Then I shoould see the park that has the best average ranking for both users
#
#  Scenario: suggest a park for a user that doesn't exist
#    Given I am on the suggest a park page
#    When I enter a username "NotAUser"
#    And that user doesnt exist in the database
#    Then I should see "The User doesn't exist" displayed on the page