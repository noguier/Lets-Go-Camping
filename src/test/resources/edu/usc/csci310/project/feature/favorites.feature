Feature: testing the favorites functionality
    Scenario: Add park to favorites
        Given I am on the search page
        When I search for "Yellowstone" in the search bar
        And Click on Add to Favorites for "Yellowstone National Park"
        Given I go to the Favorites Page
        Then I should see "Yellowstone National Park" under favorites

    Scenario: Add multiple parks to favorites
        Given: I am on search page
        And I have already added "Yellowstone National Park" to favorites
        When I search for "Redwoods" in the search bar
        And Click on Add to Favorites for "Redwoods National Park"
        Given I go to the Favorites Page
        Then I should see "Yellowstone National Park" and "Redwoods National Park" under favorites


    Scenario: Remove from Favorites
        Given I am on the search page
        And I have already added "Yellowstone National Park" to favorites
        When I search for "Yellowstone" in the search bar
        And Click on Remove from Favorites for "Yellowstone National Park"
        Given I go to the Favorites Page
        Then I should see nothing in my favorites page

    Scenario: Remove multiple parks to favorites
        Given I am on search page
        And I have already added "Yellowstone National Park" to favorites
        And I have already added "Redwoods National Park" to favorites
        When I search for "Redwoods" in the search bar
        And Click on Remove from Favorites for "Redwoods National Park"
        When I search for "Yellowstone" in the search bar
        And Click on Remove from Favorites for "Yellowstone National Park"
        Given I go to the Favorites Page
        Then I should see nothing in my favorites page


    Scenario: Review Details for Favorites
        Given I go to the Favorites Page
        And I have already added "Yellowstone National Park" to favorites
        When I select "Yellowstone National Park" from my favorites list
        Then I should see detailed information about "Yellowstone National Park" such as name, location, activites

    Scenario: Ranking Details in Favorites
        Given I go to the Favorties Page
        And I have mulipel parks already added on favorites list
        When I hover my mouse cursor over park entry
        Then I shoud see up and down arrow control appear
        And I shou;d be able change the ranking of the park higher on the list
        And the ranking changes should be reflected immediately
        And the ranking should be saved automatically





