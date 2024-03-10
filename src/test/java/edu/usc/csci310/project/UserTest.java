package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


class UserTest {

    @Test
    void setPassword() {
        // Test setPassword() method
        User user = new User();

        // Set password and test if it's set correctly
        String password = "test_password";
        user.setPassword(password);
        assertEquals(password, user.getPassword());
    }

    @Test
    void getPassword() {
        // Test getPassword() method
        User user = new User();

        // Set password and test if it's retrieved correctly
        String password = "test_password";
        user.setPassword(password);
        assertEquals(password, user.getPassword());
    }

    @Test
    void setUsername() {
        // Test setUsername() method
        User user = new User();

        // Set username and test if it's set correctly
        String username = "test_username";
        user.setUsername(username);
        assertEquals(username, user.getUsername());
    }

    @Test
    void getUsername() {
        // Test getUsername() method
        User user = new User();

        // Set username and test if it's retrieved correctly
        String username = "test_username";
        user.setUsername(username);
        assertEquals(username, user.getUsername());
    }


}
