Feature: test favorites functionality
#  Scenario: view empty favorites list
#    Given I am on the favorites page
#    And I have not added any parks to my favorites list
#    Then I should see "This list is empty"
#
#  Scenario: view favorites list
#    Given I am on the favorites page
#    And I have added "Joshua Tree National Preserve" to my favorites list
#    #details should be displayed
#    #minus button to remove from favorites appears on hover
#    #dialogue box before deleting
#    #park was deleted banner optional
#    Then I should see a list of parks including "Joshua Tree National Preserve"
#
#  Scenario: view favorites list details
#    Given I am on the favorites page
#    And I have added "Joshua Tree National Preserve" to my favorites list
#    And I see a list of parks including "Joshua Tree National Preserve"
#    And I click on "Joshua Tree National Preserve"
#    Then I see Location "Twentynine Palms, CA"
#    Then I see Entrance Fee "$30.00"
#    Then I see Description "Two distinct desert ecosystems, "
#    Then I see Amenities "Auto and ATV"
#    Then I see Activities "Yo mama"
#    Then I see Image alt-ID "The sky turns hues"
#
#  Scenario: remove from favorites list
#    Given I am on the favorites page
#    And I have added "Joshua Tree National Preserve" to my favorites list
#    And I see a list of parks including "Joshua Tree National Preserve"
#    And I hover over "Joshua Tree National Preserve"
#    When I click on the minus button displayed
#    And I click confirm on the dialogue window that appears
#    Then "Joshua Tree National Preserve" should be removed from my favorites list
#
#  Scenario: successful add to favorites list - details not expanded
#    Given I am on the search page
#    And I click the dropdown Name
#    And I enter "Joshua" in the search bar
#    And I click the Search button
#    And I should get a list of parks such as "Castle Mountains National Monument"
#    And I hover over "Castle Mountains National Monument"
#    And I click on the plus button displayed
#    And the park is not in my favorites list
#    Then I should get a message saying "Successfully added"
#
#  Scenario: successful add to favorites list - details expanded
#    Given I am on the search page
#    And I click the dropdown Name
#    And I enter "Joshua" in the search bar
#    And I click the Search button
#    And I should get a list of parks such as "Castle Mountains National Monument"
#    And I click on "Castle Mountains National Monument"
#    And there is a plus button displayed my cursor hovering over it
#    And I click on the plus button displayed
#    And the park is not in my favorites list
#    Then I should get a message saying "Successfully added"
#    #details window is open - hover button should be there even without hover
#
#  Scenario: unsuccessful add to favorites list
#    Given I am on the search page
#    And I click the dropdown Name
#    And I enter "Joshua" in the search bar
#    And I click the Search button
#    And I should get a list of parks such as "Castle Mountains National Monument"
#    And I hover over "Castle Mountains National Monument"
#    And I click on the plus button displayed
#    And the park is in my favorites list
#    Then I should get a message saying "This park has already been favorited"
#
#  Scenario: move park higher on favorites
#    Given I am on the favorites page
#    And my favorites list is not empty
#    When I hover over a park on my favorites list
#    And I click on the up arrow
#    Then I should be able to move the park higher on my favorites list
#
#  Scenario: move park lower on favorites
#    Given I am on the favorites page
#    And my favorites list is not empty
#    When I hover over a park on my favorites list
#    And I click on the down arrow
#    Then I should be able to move the park lower on my favorites list
#
#  #navigate away from the page and navigate back, changes should still be there
#  Scenario: changes are persistent
#    Given I am on the favorites page
#    And I have added "Joshua Tree National Preserve" to my favorites list
#    And I see a list of parks including "Joshua Tree National Preserve"
#    And I hover over "Joshua Tree National Preserve"
#    When I click on the minus button displayed
#    And I click confirm on the dialogue window that appears
#    Then "Joshua Tree National Preserve" should be removed from my favorites list
#    Then I should see that my changes are persistent
#
#  Scenario: update favorites list
#    Given I am on the favorites page
#    And I see a list of parks such as "Castle Mountains National Monument"
#    When I return to the search page
#    And I click the dropdown Name
#    And I enter "Joshua" in the search bar
#    And I click the Search button
#    And I should get a list of parks such as "Joshua Tree National Preserve"
#    And I hover over "Joshua Tree National Preserve"
#    And I click on the plus button displayed
#    And I return to the favorites page
#    Then I should see a list of parks including "Joshua Tree National Preserve"
#
#  #expand detail window
#
#
#
#
#
#
