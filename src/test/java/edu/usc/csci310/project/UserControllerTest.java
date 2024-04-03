package edu.usc.csci310.project;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.security.NoSuchAlgorithmException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
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
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with null username
        LoginRequest nullUsernameRequest = new LoginRequest();
        nullUsernameRequest.setUsername(null);
        nullUsernameRequest.setPassword("Test_password1");

        ResponseEntity<String> nullUsernameResponse = userController.loginUser(nullUsernameRequest, mockRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullUsernameResponse.getStatusCode());
        assertEquals("Username and password are required", nullUsernameResponse.getBody());
    }

    @Test
    void loginUser_PasswordNull() throws NoSuchAlgorithmException {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with null password
        LoginRequest nullPasswordRequest = new LoginRequest();
        nullPasswordRequest.setUsername("test_username");
        nullPasswordRequest.setPassword(null);

        ResponseEntity<String> nullPasswordResponse = userController.loginUser(nullPasswordRequest, mockRequest);
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
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with null username and password
        LoginRequest nullRequest = new LoginRequest();
        ResponseEntity<String> nullResponse = userController.loginUser(nullRequest, mockRequest);
        assertEquals(HttpStatus.BAD_REQUEST, nullResponse.getStatusCode());
        assertEquals("Username and password are required", nullResponse.getBody());
    }

//    @Test
//    void loginUser_ValidCredentials() throws NoSuchAlgorithmException {
//        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
//
//        // Test loginUser() method with valid credentials
//        LoginRequest validCredentialsRequest = new LoginRequest();
//        validCredentialsRequest.setUsername("test_username");
//        validCredentialsRequest.setPassword("Test_password1");
//
//        UserService userService = getUserServiceMock();
//        when(userService.authenticateUser("test_username", "Test_password1")).thenReturn(true);
//        when(userService.handleLoginAttempts("test_username", true)).thenReturn(true);
//
//        ResponseEntity<String> validCredentialsResponse = userController.loginUser(validCredentialsRequest, mockRequest);
//        assertEquals(HttpStatus.OK, validCredentialsResponse.getStatusCode());
//        assertEquals("Login successful", validCredentialsResponse.getBody());
//    }

    @Test
    void loginUser_InvalidCredentials() throws NoSuchAlgorithmException {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with invalid credentials
        LoginRequest invalidCredentialsRequest = new LoginRequest();
        invalidCredentialsRequest.setUsername("test_username");
        invalidCredentialsRequest.setPassword("invalidpassword");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("test_username", "invalidpassword")).thenReturn(false);
        when(userService.handleLoginAttempts("test_username", false)).thenReturn(true);

        ResponseEntity<String> invalidCredentialsResponse = userController.loginUser(invalidCredentialsRequest, mockRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, invalidCredentialsResponse.getStatusCode());
        assertEquals("Invalid username or password", invalidCredentialsResponse.getBody());
    }

    @Test
    void loginUser_LockedUser() throws NoSuchAlgorithmException {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with locked user
        LoginRequest lockedUserRequest = new LoginRequest();
        lockedUserRequest.setUsername("locked_username");
        lockedUserRequest.setPassword("Test_password1");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("locked_username", "Test_password1")).thenReturn(false);
        when(userService.handleLoginAttempts("locked_username", false)).thenReturn(false);

        ResponseEntity<String> lockedUserResponse = userController.loginUser(lockedUserRequest, mockRequest);
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


    @Test
    void loginUser_Successful() throws NoSuchAlgorithmException {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with valid credentials
        LoginRequest validCredentialsRequest = new LoginRequest();
        validCredentialsRequest.setUsername("test_username");
        validCredentialsRequest.setPassword("Test_password1");

        HttpSession mockSession = mock(HttpSession.class);
        when(mockRequest.getSession(true)).thenReturn(mockSession);

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("test_username", "Test_password1")).thenReturn(true);
        when(userService.handleLoginAttempts("test_username", true)).thenReturn(true);

        ResponseEntity<String> validCredentialsResponse = userController.loginUser(validCredentialsRequest, mockRequest);
        assertEquals(HttpStatus.OK, validCredentialsResponse.getStatusCode());
        assertEquals("Login successful", validCredentialsResponse.getBody());

        verify(mockSession).setAttribute(eq("username"), eq("test_username"));
    }

    @Test
    void loginUser_Unsuccessful() throws NoSuchAlgorithmException {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        // Test loginUser() method with invalid credentials
        LoginRequest invalidCredentialsRequest = new LoginRequest();
        invalidCredentialsRequest.setUsername("test_username");
        invalidCredentialsRequest.setPassword("invalidpassword");

        UserService userService = getUserServiceMock();
        when(userService.authenticateUser("test_username", "invalidpassword")).thenReturn(false);
        when(userService.handleLoginAttempts("test_username", false)).thenReturn(true);

        ResponseEntity<String> invalidCredentialsResponse = userController.loginUser(invalidCredentialsRequest, mockRequest);
        assertEquals(HttpStatus.UNAUTHORIZED, invalidCredentialsResponse.getStatusCode());
        assertEquals("Invalid username or password", invalidCredentialsResponse.getBody());
    }

    @Test
    void logoutUser_Successful() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        HttpSession mockSession = mock(HttpSession.class);

        when(mockRequest.getSession(false)).thenReturn(mockSession);

        ResponseEntity<String> responseEntity = userController.logoutUser(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Logout successful", responseEntity.getBody());

        verify(mockSession).invalidate();
    }

    @Test
    void logoutUser_NotLoggedIn() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getSession(false)).thenReturn(null);

        ResponseEntity<String> responseEntity = userController.logoutUser(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals("Logout successful", responseEntity.getBody());
    }

    @Test
    void isAuthenticated_Authenticated() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        HttpSession mockSession = mock(HttpSession.class);

        when(mockRequest.getSession(false)).thenReturn(mockSession);
        when(mockSession.getAttribute("username")).thenReturn("test_username");

        ResponseEntity<Boolean> responseEntity = userController.isAuthenticated(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertTrue(responseEntity.getBody());
    }

    @Test
    void isAuthenticated_NotAuthenticated() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getSession(false)).thenReturn(null);

        ResponseEntity<Boolean> responseEntity = userController.isAuthenticated(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertFalse(responseEntity.getBody());
    }

    @Test
    void isAuthenticated_SessionIsNull() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);

        when(mockRequest.getSession(false)).thenReturn(null);

        ResponseEntity<Boolean> responseEntity = userController.isAuthenticated(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertFalse(responseEntity.getBody());
    }

    @Test
    void isAuthenticated_UsernameAttributeIsNull() {
        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        HttpSession mockSession = mock(HttpSession.class);

        when(mockRequest.getSession(false)).thenReturn(mockSession);
        when(mockSession.getAttribute("username")).thenReturn(null);

        ResponseEntity<Boolean> responseEntity = userController.isAuthenticated(mockRequest);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertFalse(responseEntity.getBody());
    }



}


