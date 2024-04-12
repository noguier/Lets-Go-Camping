Feature: test create account functionality

  Scenario: cancel create and confirm
    Given I am on the create account page
    And I click on the already have account button
    When I click on Cancel Create Account button
    Then I should be redirected to the login page

  Scenario: cancel create and not confirm
    Given I am on the create account page
    And I click on the already have account button
    When I click on Go Back to Create button
    Then I should stay on create page

  Scenario: blank login attempt
    Given I am on the create account page
    When I enter the username ""
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Username and password required" message

  Scenario: empty username
    Given I am on the create account page
    When I enter the username ""
    And I enter the password "TestPassword123"
    And I press the Create Account button
    Then I should get a "Username required" message

  Scenario: empty password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password ""
    And I press the Create Account button
    Then I should get a "Password required" message

  Scenario: display descriptive error message if passwords don't match
    Given I am on the create account page
    And I enter the username "TommyTrojan"
    When I enter the password "TestPassword123"
    And I enter the confirm password "wrong"
    And I press the Create Account button
    Then I should get a "Passwords must match" message

  Scenario: no capital in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "trojan123"
    And I enter the confirm password "trojan123"
    And I press the Create Account button
    Then I should get a "Password requires uppercase" message

  Scenario: no number in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "Trojan"
    And I enter the confirm password "Trojan"
    And I press the Create Account button
    Then I should get a "Password requires digit" message

  Scenario: no lowercase in password
    Given I am on the create account page
    When I enter the username "TommyTrojan"
    And I enter the password "TROJAN"
    And I enter the confirm password "TROJAN"
    And I press the Create Account button
    Then I should get a "Password requires lowercase" message

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
    Then I should get a "Username is taken" message


  Scenario: no confirm password
    Given I am on the create account page
    And the account TommyTrojan has already been created
    When I enter the username "BillyBruin"
    And I enter the password "BillyBruin123"
    And I press the Create Account button
    Then I should get a "Confirm password required" message