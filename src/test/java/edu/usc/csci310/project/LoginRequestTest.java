package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void getUsername() {
        // Test getUsername() method
        LoginRequest loginRequest = new LoginRequest();
        assertNull(loginRequest.getUsername()); // Initial value should be null

        // Set username and test getUsername() again
        String username = "test_username";
        loginRequest.setUsername(username);
        assertEquals(username, loginRequest.getUsername());
    }

    @Test
    void setUsername() {
        // Test setUsername() method
        LoginRequest loginRequest = new LoginRequest();

        // Set username and test if it's set correctly
        String username = "test_username";
        loginRequest.setUsername(username);
        assertEquals(username, loginRequest.getUsername());
    }

    @Test
    void getPassword() {
        // Test getPassword() method
        LoginRequest loginRequest = new LoginRequest();
        assertNull(loginRequest.getPassword()); // Initial value should be null

        // Set password and test getPassword() again
        String password = "test_password";
        loginRequest.setPassword(password);
        assertEquals(password, loginRequest.getPassword());
    }

    @Test
    void setPassword() {
        // Test setPassword() method
        LoginRequest loginRequest = new LoginRequest();

        // Set password and test if it's set correctly
        String password = "test_password";
        loginRequest.setPassword(password);
        assertEquals(password, loginRequest.getPassword());
    }
}
