#Feature: Secure Transmission of User Data - login page inaccessible without SSL for every page
#Scenario: User login with encrypted data transmission
#Given a user wants to log in to their account with Http vs https
#When the user enters their credentials and submits the form
#Then the system encrypts the user credentials before transmitting them over the network
#
##only logged in users can use the website
#Scenario: Accessing user information
#Given a user is logged into their accoun
#When the user attempts to access their profile or sensitive information
#Then the system ensures that only authorized users can view the requested information and employs access control mechanisms to prevent unauthorized access
#
#
#
