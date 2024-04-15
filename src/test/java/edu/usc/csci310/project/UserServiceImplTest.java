package edu.usc.csci310.project;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl();
        userService.userRepository = userRepository;
    }

    @Test
    void createUser() throws NoSuchAlgorithmException {
        when(userRepository.save(any())).thenReturn(new User());
        User user = userService.createUser("username", "password");
        assertNotNull(user);
        verify(userRepository, times(1)).save(any());
    }

    @Test
    void usernameExists_UserExists() throws NoSuchAlgorithmException {
        when(userRepository.findByUsername(any())).thenReturn(new User());
        assertTrue(userService.usernameExists("username"));
        verify(userRepository, times(1)).findByUsername(any());
    }

    @Test
    void usernameExists_UserDoesNotExist() throws NoSuchAlgorithmException {
        when(userRepository.findByUsername(any())).thenReturn(null);
        assertFalse(userService.usernameExists("username"));
        verify(userRepository, times(1)).findByUsername(any());
    }

    @Test
    void handleLoginAttempts_WithinLockoutPeriod() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lockoutTime = now.minusSeconds(29);

        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername("username")).thenReturn(user);

        userService.lockoutTimestamps.put("username", lockoutTime);

        assertFalse(userService.handleLoginAttempts("username", false));

        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    void handleLoginAttempts_LockoutPeriodExpired() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lockoutTime = now.minusSeconds(31);

        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername("username")).thenReturn(user);

        userService.lockoutTimestamps.put("username", lockoutTime);

        assertTrue(userService.handleLoginAttempts("username", false));

        verify(userRepository, never()).findByUsername(any());
    }
    private void handleLoginAttempts_SetUp(LocalDateTime firstAttempt) {
        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername("username")).thenReturn(user);

        List<LocalDateTime> attempts = new ArrayList<>();
        attempts.add(firstAttempt);
        attempts.add(firstAttempt);
        attempts.add(firstAttempt);
        userService.loginAttempts.put("username", attempts);
    }
    @Test
    void handleLoginAttempts_AttemptsWithinMinute() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstAttempt = now.minusSeconds(15);
        handleLoginAttempts_SetUp(firstAttempt);
        assertFalse(userService.handleLoginAttempts("username", false));
        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    void handleLoginAttempts_AttemptsExpired() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime firstAttempt = now.minusSeconds(61);
        handleLoginAttempts_SetUp(firstAttempt);
        assertTrue(userService.handleLoginAttempts("username", false));
        verify(userRepository, never()).findByUsername(any());
    }

    @Test
    void handleLoginAttempts_SuccessfulAuthentication() {
        LocalDateTime now = LocalDateTime.now();

        User user = new User();
        user.setUsername("username");

        when(userRepository.findByUsername("username")).thenReturn(user);

        List<LocalDateTime> attempts = new ArrayList<>();
        attempts.add(now.minusSeconds(31));
        attempts.add(now.minusSeconds(15));
        userService.loginAttempts.put("username", attempts);

        assertTrue(userService.handleLoginAttempts("username", true));

        verify(userRepository, never()).findByUsername(any());
    }


    @Test
    void authenticateUser_SuccessfulAuthentication() throws NoSuchAlgorithmException {
        String username = "username";
        String password = "password";

        User user = new User();
        user.setUsername(username);
        user.setPassword(user.hashPassword(password));

        when(userRepository.findByUsername(user.hashPassword(username))).thenReturn(user);

        assertTrue(userService.authenticateUser(username, password));
    }

    @Test
    void authenticateUser_AuthenticationFailed() throws NoSuchAlgorithmException {
        String username = "username";
        String password = "password";

        when(userRepository.findByUsername(any())).thenReturn(null);

        assertFalse(userService.authenticateUser(username, password));
    }

    @Test
    void isValidPassword_ValidPassword() {
        String validPassword = "ValidPassword1";

        assertTrue(userService.isValidPasswordLC(validPassword));
    }

    @Test
    void isValidPassword_InvalidPassword_NoLowercase() {
        String invalidPassword = "INVALIDPASSWORD1";

        assertFalse(userService.isValidPasswordLC(invalidPassword));
    }

    @Test
    void isValidPassword_InvalidPassword_NoUppercase() {
        String invalidPassword = "invalidpassword1";

        assertFalse(userService.isValidPasswordUC(invalidPassword));
    }

    @Test
    void isValidPassword_InvalidPassword_NoDigit() {
        String invalidPassword = "InvalidPassword";

        assertFalse(userService.isValidPasswordDG(invalidPassword));
    }

    @Test
    void authenticateUser_AuthenticationFailed_PasswordMismatch() throws NoSuchAlgorithmException {
        String username = "username";
        String password = "password";
        String incorrectPassword = "incorrectPassword";

        User user = new User();
        user.setUsername(username);
        user.setPassword(user.hashPassword(password));

        when(userRepository.findByUsername(user.hashPassword(username))).thenReturn(user);

        assertFalse(userService.authenticateUser(username, incorrectPassword));
    }
}









