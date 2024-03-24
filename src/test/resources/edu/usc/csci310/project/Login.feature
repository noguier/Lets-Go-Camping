Feature: test the login functionality

  Scenario: need to create new account
    Given I am on the login page
    When I click on the Don't have account button
    Then I should be redirected to the Create Account page

  Scenario: successful login
    Given I am on the login page
    And Tommy is a registered user
    When I enter the username "Tommy"
    And I enter the password "Trojan123"
    And I click the login button
    Then I should be redirected to the Dashboard page

  Scenario: invalid login
    Given I am on the login page
    When I enter the username "Wrong"
    And I enter the password "Wrong"
    And I click the login button
    Then "Login Unsuccessful, Invalid username or password" message

  Scenario: missing username and password
    Given I am on the login page
    When I enter the username ""
    And I enter the password ""
    And I click the login button
    Then "Login Unsuccessful, Username and password are required" message

  Scenario: missing username
    Given I am on the login page
    When I enter the username ""
    And I enter the password "Wrong"
    And I click the login button
    Then "Login Unsuccessful, Username required" message

  Scenario: missing password
    Given I am on the login page
    When I enter the username "Wrong"
    And I enter the password ""
    And I click the login button
    Then "Login Unsuccessful, Password required" message

  Scenario: 3 consecutive incorrect attempts not within one minute
    Given I am on the login page
    And I have tried unsuccessfully to login in the three previous attempts
    And I wait thirty seconds
    When I enter the username "Wrong"
    And I enter the password "Wrong"
    And I click the login button
    Then I should still be allowed to login

  Scenario: account locked in 3 consecutive wrong tries in one minute
    Given I am on the login page
    And I have tried two unsuccessful login attempts in one min
    When I enter the username "Wrong"
    And I enter the password "Wrong"
    And I click the login button
    Then I should not be allowed to login anymore

  Scenario: account block is reset after 30 seconds
    Given I am on the login page
    And I have tried unsuccessfully to login in the three previous attempts
    And I wait thirty seconds
    When I enter the username "Wrong"
    And I enter the password "Wrong"
    And I click the login button
    Then I should still be allowed to login

