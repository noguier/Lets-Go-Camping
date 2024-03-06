Feature: test the create account functionality of the website
  Scenario: a successful account creation
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password "Abc_123"
    And I press the Create Account button
    Then I should get a "Account Creation Successful" message
  Scenario: account already exists
    Given I am on the create account page
    And the account "ParkEnjoyer" has already been created
    When I enter the username "ParkEnjoyer"
    And I enter the password "Abc_123"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, this username is taken" message
  Scenario: blank login attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, username and password required" message
  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the password "Abc_123"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, username required" message
  Scenario: empty password
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password required" message
  Scenario: password too short
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password "Abc_12"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must be at least 7 characters long" message
  Scenario: no capital in password
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password "abc_12"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one capital letter" message
  Scenario: no special character in password
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password "abc1234"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one special character" message
  Scenario: no number in password
    Given I am on the create account page
    When I enter the username "ParkEnjoyer"
    And I enter the password "abc_def"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one number" message