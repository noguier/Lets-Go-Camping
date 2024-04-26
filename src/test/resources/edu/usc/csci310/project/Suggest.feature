Feature: test suggest a park functionality
  Scenario: suggest a park for two users
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    When I enter a username "TallyTrojan"
#    And I click compare button
#    Then I should see the information about one park that is on Favorite list of both users
#
#  Scenario: suggest a park for a user with private Favorites list
#    Given I am on the suggest a park page
#    When I enter a username "BillyBruin"
#    And I click add a user button
#    And "BillyBruin" doesn't have a public list of favorites
#    Then I should see ""BillyBruin"doesnt have a public Favorites List" displayed on the page
#
#  Scenario: suggest a park for three users
#    Given I am on the suggest a park page
#    And I have "Joshua tree" park on my favorite list
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Joshua tree" park on his favorite list
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I enter username "TallyTrojan"
#    And "Tally Trojan" has "Joshua tree" park on her favorite list
#    And I click add a user button
#    And "TallyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click suggest button
#    Then I should see the park name that is on all of the selected users favorite lists such as "Joshua Tree"
#
#  Scenario: suggest a park for users with more than 1 match
#    Given I am on the suggest a park page
#    And I have "Joshua tree" park on my favorite list with the rank 2
#    And I have "Yellowstone Park" park on my favorite list with the rank 1
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Joshua tree" park on his favorite list with the rank 1
#    And "Tommy Trojan" has "Yellowstone Park" park on his favorite list with the rank 2
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I enter username "TallyTrojan"
#    And "Tally Trojan" has "Joshua tree" park on her favorite list with the rank 1
#    And "Tally Trojan" has "Yellowstone Park" park on her favorite list with the rank 2
#    And I click add a user button
#    And "TallyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click suggest button
#    Then I should see the park name that is on all of the selected users favorite lists with the highest ranking such as "Joshua Tree"
#
   # Scenario: suggest a park for users with more than 0 matches
#    Given I am on the suggest a park page
#    When I enter a username "TommyTrojan"
#    And "Tommy Trojan" has "Joshua tree" park on his favorite list with the rank 1
#    And "Tommy Trojan" has "Alcatraz" park on his favorite list with the rank 2
#    And I click add a user button
#    And "TommyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I enter username "TallyTrojan"
#    And "Tally Trojan" has "Yosemity" park on her favorite list with the rank 1
#    And "Tally Trojan" has "Mojave Desert" park on her favorite list with the rank 2
#    And I click add a user button
#    And "TallyTrojan" has a public list of favorites
#    And I see "User successfully added" displayed on the page
#    And I click suggest button
#    Then I should see the park name with the highest ranking from the most popular state displaed on the page such as "Joshua Tree"

  Scenario: suggest a park for a user that doesn't exist
    Given I am on the suggest a park page
    When I enter a username "NotAUser"
    And I click add a user button
    And that user doesnt exist in the database
    Then I should see "User does not exist" displayed on the page

#  Scenario: See the details of the park
#    Given I am on the suggest a park page
#    And I have "Yellowstone Park" park on my favorite list with the rank 1
 #    When I enter a username "TommyTrojan"
 #    And "Tommy Trojan" has "Yellowstone National Park" park on his Favorites list
 #    And I click add a user button
 #    And "TommyTrojan" has a public list of favorites
 #    And I see "User successfully added" displayed on the page
 #    And I click suggest button
 #    Then I should see the all the parks that are on Favorite list of all users such as "Yellowstone National Park"
 #    And I click on "Yellowstone National Park" and see details
 #    Then I see Location state "Yellowstone National Park, WY"
 #    Then I see Entrance Fee "$35.00"
 #    Then I see Description "On March 1, 1872,"
 #    Then I see Amenities "Arts and Culture"
 #    Then I see Image alt-ID "Brilliant blues and greens"