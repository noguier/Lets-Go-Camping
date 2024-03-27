package edu.usc.csci310.project;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.security.NoSuchAlgorithmException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    private UserController userController;

    @BeforeEach
    void setUp() {
        userController = new UserController();
        // Inject mock UserService into UserController using reflection
        try {
            Field userServiceField = UserController.class.getDeclaredField("userService");
            userServiceField.setAccessible(true);
            UserService userService = mock(UserService.class);
            userServiceField.set(userController, userService);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    @Test
    void createUser_UsernameNull() throws NoSuchAlgorithmException {
        // Test createUser() method with null username
        CreateUserRequest nullUsernameRequest = new CreateUserRequest();
        nullUsernameRequest.setUsername(null);
        nullUsernameRequest.setPassword("Test_password1");

        ResponseEntity<String> nullUsernameResponse = userController.createUser(nullUsernameRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullUsernameResponse.getStatusCode());
        assertEquals("Username and password required", nullUsernameResponse.getBody());
    }

    @Test
    void createUser_PasswordNull() throws NoSuchAlgorithmException {
        // Test createUser() method with null password
        CreateUserRequest nullPasswordRequest = new CreateUserRequest();
        nullPasswordRequest.setUsername("test_username");
        nullPasswordRequest.setPassword(null);

        ResponseEntity<String> nullPasswordResponse = userController.createUser(nullPasswordRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullPasswordResponse.getStatusCode());
        assertEquals("Username and password required", nullPasswordResponse.getBody());
    }

    @Test
    void loginUser_UsernameNull() throws NoSuchAlgorithmException {
        // Test loginUser() method with null username
        LoginRequest nullUsernameRequest = new LoginRequest();
        nullUsernameRequest.setUsername(null);
        nullUsernameRequest.setPassword("Test_password1");

        ResponseEntity<String> nullUsernameResponse = userController.loginUser(nullUsernameRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullUsernameResponse.getStatusCode());
        assertEquals("Username and password are required", nullUsernameResponse.getBody());
    }

    @Test
    void loginUser_PasswordNull() throws NoSuchAlgorithmException {
        // Test loginUser() method with null password
        LoginRequest nullPasswordRequest = new LoginRequest();
        nullPasswordRequest.setUsername("test_username");
        nullPasswordRequest.setPassword(null);

        ResponseEntity<String> nullPasswordResponse = userController.loginUser(nullPasswordRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullPasswordResponse.getStatusCode());
        assertEquals("Username and password are required", nullPasswordResponse.getBody());
    }


    @Test
    void createUser_UsernameAndPasswordNull() throws NoSuchAlgorithmException {
        // Test createUser() method with null username and password
        CreateUserRequest nullRequest = new CreateUserRequest();
        ResponseEntity<String> nullResponse = userController.createUser(nullRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullResponse.getStatusCode());
        assertEquals("Username and password required", nullResponse.getBody());
    }

    @Test
    void createUser_ExistingUsername() throws NoSuchAlgorithmException {
        // Test createUser() method with existing username
        CreateUserRequest existingUsernameRequest = new CreateUserRequest();
        existingUsernameRequest.setUsername("test_username");
        existingUsernameRequest.setPassword("Test_password1");

        UserService userService = getUserServiceMock();
        when(userService.usernameExists("test_username")).thenReturn(true);

        ResponseEntity<String> existingUsernameResponse = userController.createUser(existingUsernameRequest);
        assertEquals(HttpStatus.BAD_REQUEST, existingUsernameResponse.getStatusCode());
        assertEquals("Username is taken", existingUsernameResponse.getBody());
    }

    @Test
    void createUser_InvalidPassword() throws NoSuchAlgorithmException {
        // Test createUser() method with invalid password
        CreateUserRequest invalidPasswordRequest = new CreateUserRequest();
        invalidPasswordRequest.setUsername("test_username");
        invalidPasswordRequest.setPassword("invalidpassword");

        UserService userService = getUserServiceMock();
        when(userService.isValidPassword("invalidpassword")).thenReturn(false);

        ResponseEntity<String> invalidPasswordResponse = userController.createUser(invalidPasswordRequest);
        assertEquals(HttpStatus.BAD_REQUEST, invalidPasswordResponse.getStatusCode());
        assertEquals("Password does not fit all requirements", invalidPasswordResponse.getBody());
    }

    @Test
    void createUser_Successful() throws NoSuchAlgorithmException {
        // Test createUser() method with successful account creation
        CreateUserRequest validRequest = new CreateUserRequest();
        validRequest.setUsername("test_username");
        validRequest.setPassword("Test_password1");

        UserService userService = getUserServiceMock();
        when(userService.usernameExists("test_username")).thenReturn(false);
        when(userService.isValidPassword("Test_password1")).thenReturn(true);

        ResponseEntity<String> responseEntity = userController.createUser(validRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Account created successfully", responseEntity.getBody());
    }

    @Test
    void loginUser_UsernameAndPasswordNull() throws NoSuchAlgorithmException {
        // Test loginUser() method with null username and password
        LoginRequest nullRequest = new LoginRequest();
        ResponseEntity<String> nullResponse = userController.loginUser(nullRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullResponse.getStatusCode());
        assertEquals("Username and password are required", nullResponse.getBody());
    }

    @Test
    void loginUser_ValidCredentials() throws NoSuchAlgorithmException {
        // Test loginUser() method with valid credentials
        LoginRequest validCredentialsRequest = new LoginRequest();
        validCredentialsRequest.setUsername("test_username");
        validCredentialsRequest.setPassword("Test_password1");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("test_username", "Test_password1")).thenReturn(true);
        when(userService.handleLoginAttempts("test_username", true)).thenReturn(true);

        ResponseEntity<String> validCredentialsResponse = userController.loginUser(validCredentialsRequest);
        assertEquals(HttpStatus.OK, validCredentialsResponse.getStatusCode());
        assertEquals("Login successful", validCredentialsResponse.getBody());
    }

    @Test
    void loginUser_InvalidCredentials() throws NoSuchAlgorithmException {
        // Test loginUser() method with invalid credentials
        LoginRequest invalidCredentialsRequest = new LoginRequest();
        invalidCredentialsRequest.setUsername("test_username");
        invalidCredentialsRequest.setPassword("invalidpassword");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("test_username", "invalidpassword")).thenReturn(false);
        when(userService.handleLoginAttempts("test_username", false)).thenReturn(true);

        ResponseEntity<String> invalidCredentialsResponse = userController.loginUser(invalidCredentialsRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, invalidCredentialsResponse.getStatusCode());
        assertEquals("Login Unsuccessful, Invalid username or password", invalidCredentialsResponse.getBody());
    }

    @Test
    void loginUser_LockedUser() throws NoSuchAlgorithmException {
        // Test loginUser() method with locked user
        LoginRequest lockedUserRequest = new LoginRequest();
        lockedUserRequest.setUsername("locked_username");
        lockedUserRequest.setPassword("Test_password1");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("locked_username", "Test_password1")).thenReturn(false);
        when(userService.handleLoginAttempts("locked_username", false)).thenReturn(false);

        ResponseEntity<String> lockedUserResponse = userController.loginUser(lockedUserRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, lockedUserResponse.getStatusCode());
        assertEquals("Login Unsuccessful, You are locked out. Please try again after 30 seconds.", lockedUserResponse.getBody());
    }

    private UserService getUserServiceMock() {
        try {
            Field userServiceField = UserController.class.getDeclaredField("userService");
            userServiceField.setAccessible(true);
            return (UserService) userServiceField.get(userController);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
            return null;
        }
    }
}


