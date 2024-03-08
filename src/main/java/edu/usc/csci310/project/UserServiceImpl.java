package edu.usc.csci310.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    User user = new User();

    @Override
    public User createUser(String username, String password) throws NoSuchAlgorithmException {
        user.setUsername(user.hashPassword(username));
        user.setPassword(user.hashPassword(password));
        return userRepository.save(user);
    }

    @Override
    public boolean usernameExists(String username) throws NoSuchAlgorithmException {
        return userRepository.findByUsername(user.hashPassword(username)) != null;
    }

    @Override
    public boolean isValidPassword(String password) {
        // Implement password validation logic (e.g., minimum length, contains capital letters, etc.)
        // Example: Password must be at least 8 characters long and contain at least one uppercase letter and one digit
        return password.matches(".*[A-Z].*") && password.matches(".*\\d.*");
    }


    @Override
    public boolean authenticateUser(String username, String password) throws NoSuchAlgorithmException {
        User temp = new User();
        User other = userRepository.findByUsername(temp.hashPassword(username));
//        System.out.println(username);

        if (other != null) {
            String hashedPassword = temp.hashPassword(password); // Hash the provided password
//            System.out.println(password);
//            System.out.println(hashedPassword);
//
//            System.out.println(user.getUsername());
//            System.out.println(user.getPassword());

            if (other.getPassword().equals(hashedPassword)) {
                // Authentication successful
                return true;
            }
        }

        // Authentication failed
        return false;
    }

    final Map<String, List<LocalDateTime>> loginAttempts = new ConcurrentHashMap<>();
    final Map<String, LocalDateTime> lockoutTimestamps = new ConcurrentHashMap<>();

    @Override
    public boolean handleLoginAttempts(String username, boolean isAuthenticated) {
        List<LocalDateTime> attempts = loginAttempts.computeIfAbsent(username, k -> new ArrayList<>());
        LocalDateTime now = LocalDateTime.now();

        // If the user is locked out
        if (lockoutTimestamps.containsKey(username)) {
            LocalDateTime lockoutTime = lockoutTimestamps.get(username);
            long secondsSinceLockout = lockoutTime.until(now, ChronoUnit.SECONDS);
            if (secondsSinceLockout < 30) {
                // Still within the lockout period
                return false; // User is locked out
            } else {
                // Lockout period has passed, remove the lockout entry
                lockoutTimestamps.remove(username);
                attempts.clear(); // Reset attempts
            }
        }

        // If authentication fails, add current attempt to the list
        if (!isAuthenticated) {
            attempts.add(now);
            int totalAttempts = attempts.size();

            if (totalAttempts >= 3) {
                LocalDateTime firstAttempt = attempts.get(0);
                long secondsSinceFirstAttempt = firstAttempt.until(now, ChronoUnit.SECONDS);
                if (secondsSinceFirstAttempt <= 60) {
                    // User has made 3 attempts within a minute
                    lockoutTimestamps.put(username, now); // Lock the user out
                    return false; // User is locked out
                } else {
                    // Reset attempts since it's been more than a minute
                    attempts.clear();
                }
            }
        } else {
            // If authentication is successful, clear the attempts list
            attempts.clear();
        }

        return true; // User is not locked out
    }




//if size greater than or equal 3, then check if the first attempt is within the last minute, if not then clear attempts, if yes then return isBlocked is true
// if 30 seconds have passed since the last unsuccessful attempt while isBlocked is true, then set isBlocked to false if 30 secs passed from last attempt while blocked, attempts clear

}




