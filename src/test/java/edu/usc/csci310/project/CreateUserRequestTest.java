package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CreateUserRequestTest {

    @Test
    void getUsername() {
        // Test getUsername() method
        CreateUserRequest createUserRequest = new CreateUserRequest();
        assertNull(createUserRequest.getUsername()); // Initial value should be null

        // Set username and test getUsername() again
        String username = "test_username";
        createUserRequest.setUsername(username);
        assertEquals(username, createUserRequest.getUsername());
    }

    @Test
    void setUsername() {
        // Test setUsername() method
        CreateUserRequest createUserRequest = new CreateUserRequest();

        // Set username and test if it's set correctly
        String username = "test_username";
        createUserRequest.setUsername(username);
        assertEquals(username, createUserRequest.getUsername());
    }

    @Test
    void getPassword() {
        // Test getPassword() method
        CreateUserRequest createUserRequest = new CreateUserRequest();
        assertNull(createUserRequest.getPassword()); // Initial value should be null

        // Set password and test getPassword() again
        String password = "test_password";
        createUserRequest.setPassword(password);
        assertEquals(password, createUserRequest.getPassword());
    }

    @Test
    void setPassword() {
        // Test setPassword() method
        CreateUserRequest createUserRequest = new CreateUserRequest();

        // Set password and test if it's set correctly
        String password = "test_password";
        createUserRequest.setPassword(password);
        assertEquals(password, createUserRequest.getPassword());
    }
}
