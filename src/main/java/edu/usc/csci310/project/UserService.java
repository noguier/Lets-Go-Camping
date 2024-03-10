package edu.usc.csci310.project;

import java.security.NoSuchAlgorithmException;

public interface UserService {
    User createUser(String username, String password) throws NoSuchAlgorithmException;
    boolean usernameExists(String username) throws NoSuchAlgorithmException;
    boolean isValidPassword(String password);
    boolean authenticateUser(String username, String password) throws NoSuchAlgorithmException;
    boolean handleLoginAttempts(String username, boolean isAuthenticated);
}




