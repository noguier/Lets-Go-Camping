Feature: test favorites functionality
  Scenario: view empty favorites list
<<<<<<< HEAD
    Given I am now on the favorites page
    And I have not added any parks to my favorites list
    Then I should see "This list is empty"

  Scenario: view favorites list
    Given I am now on the favorites page
    And I have added "Joshua Tree" to my favorites list
    And I return to the favorites page
    Then I should see a list of parks including "Joshua Tree National Preserve"

  Scenario: view empty favorites list
    Given I am now on the favorites page
    And I have not added any parks to my favorites list
    Then I should see "This list is empty"

  Scenario: view favorites list
    Given I am now on the favorites page
    And I have added "Joshua Tree" to my favorites list
    Then I should see a list of parks including "Joshua Tree National Preserve"

  Scenario: view favorites list details
    Given I am now on the favorites page
    And I have added "Joshua Tree" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I click on "Joshua Tree National Preserve"
    Then I see Location "Twentynine, CA"
    Then I see Entrance Fee "$30.00"
    Then I see Description "Two distinct desert ecosystems, "
    Then I see Amenities "Automated External Defibrillator (AED)"
    Then I see Activities "Auto and ATV"
    Then I see Image alt-ID "The sky turns hues"

  Scenario: remove from favorites list
    Given I am now on the favorites page
    And I have added "Joshua Tree" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve" container
    When I click on the minus button displayed
    And I click confirm on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be removed from my favorites list

    Scenario: remove from favorites list, cancel
      Given I am now on the favorites page
    And I have added "Joshua Tree" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve" container
    When I click on the minus button displayed
    And I click cancel on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be on my favorites list

  Scenario: move park higher on favorites
    Given I am now on the favorites page
    And my favorites list is not empty
    And I click on the up arrow
    Then I should be able to move the park higher on my favorites list

  Scenario: move park lower on favorites
    Given I am now on the favorites page
    And my favorites list is not empty
    And I click on the down arrow
    Then I should be able to move the park lower on my favorites list

  Scenario: changes are persistent
    Given I am now on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve" container
    When I click on the minus button displayed
    And I click confirm on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be removed from my favorites list
    And I navigate away from the page
    Then I should see that my changes are persistent

  Scenario: update favorites list
    Given I am now on the favorites page
    And I see a list of parks such as "Castle Mountains National Monument"
    When I return to the search page
    And I click the dropdown Name
    And I enter "Joshua" in the search bar
    And I click the Search button
    And I should get a list of parks such as "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve" container
    And I click on the plus button displayed
    And I return to the favorites page
    Then I should see a list of parks including "Joshua Tree National Preserve"

    Scenario: remove all favorites list
      Given I am now on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I have added "Yellowstone National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    When I click remove all
    And I click confirm on the dialogue window that appears
    Then I should see "This list is empty"

    Scenario: list is private by default
      Given I am now on the favorites page
    Then My favorites list should be set to private by default

    Scenario: list can be toggled to public, changes are persistent
      Given I am now on the favorites page
    And my list is private
    And I toggle the private button
    Then  My favorites list should be public
    And I navigate away from the page
    Then I should see that my changes are persistent
=======
    Given I am on the favorites page
    And I have not added any parks to my favorites list
    Then I should see "This list is empty"

  Scenario: view favorites list
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    Then I should see a list of parks including "Joshua Tree National Preserve"

  Scenario: view favorites list details
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I click on "Joshua Tree National Preserve"
    Then I see Location "Twentynine, CA"
    Then I see Entrance Fee "$30.00"
    Then I see Description "Two distinct desert ecosystems, "
    Then I see Amenities "Automated External Defibrillator (AED)"
    Then I see Activities "Auto and ATV"
    Then I see Image alt-ID "The sky turns hues"

  Scenario: remove from favorites list
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve"
    When I click on the minus button displayed
    And I click confirm on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be removed from my favorites list

    Scenario: remove from favorites list, cancel
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve"
    When I click on the minus button displayed
    And I click cancel on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be on my favorites list

  Scenario: move park higher on favorites
    Given I am on the favorites page
    And my favorites list is not empty
    When I hover over a park on my favorites list
    And I click on the up arrow
    Then I should be able to move the park higher on my favorites list

  Scenario: move park lower on favorites
    Given I am on the favorites page
    And my favorites list is not empty
    When I hover over a park on my favorites list
    And I click on the down arrow
    Then I should be able to move the park lower on my favorites list

  Scenario: changes are persistent
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve"
    When I click on the minus button displayed
    And I click confirm on the dialogue window that appears
    Then "Joshua Tree National Preserve" should be removed from my favorites list
    And I navigate away from the page
    Then I should see that my changes are persistent

  Scenario: update favorites list
    Given I am on the favorites page
    And I see a list of parks such as "Castle Mountains National Monument"
    When I return to the search page
    And I click the dropdown Name
    And I enter "Joshua" in the search bar
    And I click the Search button
    And I should get a list of parks such as "Joshua Tree National Preserve"
    And I hover over "Joshua Tree National Preserve"
    And I click on the plus button displayed
    And I return to the favorites page
    Then I should see a list of parks including "Joshua Tree National Preserve"

    Scenario: remove all favorites list
    Given I am on the favorites page
    And I have added "Joshua Tree National Preserve" to my favorites list
    And I have added "Yellowstone National Preserve" to my favorites list
    And I see a list of parks including "Joshua Tree National Preserve"
    When I click remove all
    And I click confirm on the dialogue window that appears
    Then I should see "This list is empty"

#    Scenario: list is private by default
#    Given I am on the favorites page
#    My favorites list should be set to private by default
#
#    Scenario: list can be toggled to public, changes are persistent
#    Given I am on the favorites page
#    And my list is private
#    And I toggle the private button
#    My favorites list should be public
#    And I navigate away from the page
#    Then I should see that my changes are persistent
>>>>>>> develop
