Feature: Security
  Scenario: User login with encrypted data transmission
    Given I try to access our landing page with http
    Then the server should reject the connection
  Scenario: User create with encrypted data transmission
    Given I try to access create page with http
    Then the server should reject the connection
  Scenario: Search page with encrypted data transmission
    Given I try to access search page with http
    Then the server should reject the connection
  Scenario: Compare and Suggest with encrypted data transmission
    Given I try to access compare and suggest page with http
    Then the server should reject the connection
  Scenario:Favorites with encrypted data transmission
    Given I try to access favorites page with http
    Then the server should reject the connection




#
##only logged in users can use the website
#Scenario: Accessing user information
#Given a user is logged into their account
#When the user attempts to access their profile or sensitive information
#Then the system ensures that only authorized users can view the requested information and employs access control mechanisms to prevent unauthorized access
#
##
##
##
##  Scenario: Accessing the Login page via HTTP
##    Given I have the SSl certificates installed on my machine
##    When I attempts to access the login page with "http:localhost:8080/login"
##    Then the server should automatically redirect the me to the HTTPS version
##
##  Scenario: Accessing the Login page via HTTPS
##    Given I have the SSl certificates installed on my machine
##    When I attempts to access the login page with "https:localhost:8080/login"
##    Then the server should successfully load the page
##
##  Scenario: Attempting to bypass HTTPS by manually entering HTTP URL
##   Given I have the SSl certificates installed on my machine
##    And the user is on the HTTPS version of the website
##    When the user manually changes the URL from HTTPS to HTTP in the browser address bar
##    Then the server should redirect back to the HTTPS version of the page
##
##  Scenario: Access internal links within the website
##    Given the user is browsing the website over HTTPS
##    When the user clicks on any internal link within the website
##    Then the browser should not switch to HTTP and the new page loads over HTTPS
#
##
##  Scenario: Access the website via HTTPS with invalid or expired SSL certificate
##    When a user attempts to access the website with an invalid or expired SSL certificate
##    Then the browser should display a warning about the security risk
##    And not allow the user to view the site without bypassing the warning
##
#
