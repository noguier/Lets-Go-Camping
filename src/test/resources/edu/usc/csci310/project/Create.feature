Feature: test the create account functionality of the national park app

  Scenario: need to login
    Given I am on the create account page
    When I click on the already have account button
    Then I should be redirected to the login page

  Scenario: blank login attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, username and password required" message

  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the password "TestPassword123"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, username required" message

  Scenario: empty password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password required" message

  Scenario: display descriptive error message if passwords don't match
    Given I am on the create account page
    And I enter the username "TommyTrojan"
    When I enter the password "TestPassword123"
    And I enter the confirm password "wrong"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, passwords must match" message


  Scenario: no capital in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "trojan123"
    And I enter the confirm password "trojan123"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one capital letter, one lowercase letter, and one number" message

  Scenario: no number in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "Trojan"
    And I enter the confirm password "Trojan"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one capital letter, one lowercase letter, and one number" message

  Scenario: no lowercase in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "TROJAN"
    And I enter the confirm password "TROJAN"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, password must contain at least one capital letter, one lowercase letter, and one number" message

  Scenario: successful account creation
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "TestPassword123"
    And I enter the confirm password "TestPassword123"
    And I press the Create Account button
    Then I should be redirected to the login page

  Scenario: account already exists
    Given I am on the create account page
    And the account TommyTrojan has already been created
    When I enter the username "BillyBruin"
    And I enter the password "BillyBruin123"
    And I enter the confirm password "BillyBruin123"
    And I press the Create Account button
    Then I should get a "Account Creation Unsuccessful, this username is taken" message

