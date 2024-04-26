Feature: test compare a park functionality

    Scenario: compare a park for a user that doesn't exist
    Given I am on the compare a park page
    When I enter a username "NotAUser"
    And I click search button
    Then I should see "The User doesn't exist" displayed on the page

  Scenario: compare a park for two users
    Given I am on the compare a park page
    When I enter a username "USC"
    And I click search button
#    And "USC" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click suggest button
#    Then I should see the all the parks that are on Favorite list of at least one user
#
#  Scenario: compare a park for a user with private Favorites list
#    Given I am on the compare a park page
#    When I enter a username "BillyBruin"
#    And I click add a user button
#    And "BillyBruin" has a private list of favorites
#    Then I should see ""BillyBruin" doesnt have a public Favorites List" displayed on the page
#
##    two people out of three like joshua tree then it should displayed "liked by 2 out of 3"

#  Scenario: compare a park for three users
#    Given I am on the compare a park page
#    And My favorites list doesnt have a "Joshua Tree" Park
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Joshua Tree" park on his Favorites list
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I enter a username "Tally Trojan
#    And "Tally Trojan" has "Joshua Tree" park on her Favorites list
#    And I click add a user button
#    And "Tally Trojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click compare a park button
#    Then I should see the all the parks that are on Favorite list of at least one user such as "Joshua Tree"
#    And I should see the 2/3 ratio on the "Joshua Tree" park
#
#  Scenario: compare a park for three users and see which user like that park
#    Given I am on the compare a park page
#    And My favorites list doesnt have a "Joshua Tree" Park
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Joshua Tree" park on his Favorites list
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And "Tally Trojan" has "Joshua Tree" park on her Favorites list
#    And I click add a user button
#    And "Tally Trojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click compare a park button
#    Then I should see the all the parks that are on Favorite list of at least one user such as "Joshua Tree"
#    And I should see the 2/3 ratio on the "Joshua Tree" park
#    And I hover over "Joshua Tree" park
#    Then I should see that "Tommy Trojan" and "Tally Trojan" liked that park
#
#  Scenario: See the details of the park
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Yellowstone National Park" park on his Favorites list
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click compare button
#    Then I should see the all the parks that are on Favorite list of at least one user such as "Yellowstone National Park"
#    And I click on "Yellowstone National Park" and see details
#    Then I see Location state "Yellowstone National Park, WY"
#    Then I see Entrance Fee "$35.00"
#    Then I see Description "On March 1, 1872,"
#    Then I see Amenities "Arts and Culture"
#    Then I see Image alt-ID "Brilliant blues and greens"
#
#