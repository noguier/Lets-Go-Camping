package edu.usc.csci310.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest request) throws NoSuchAlgorithmException {
        // Validate request
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Account Creation Unsuccessful, username and password required");
        }

        // Check if username already exists
        if (userService.usernameExists(request.getUsername())) {
            return ResponseEntity.badRequest().body("Account Creation Unsuccessful, this username is taken");
        }

        // Validate password
        if (!userService.isValidPassword(request.getPassword())) {
            return ResponseEntity.badRequest().body("Account Creation Unsuccessful, password must contain at least one capital letter, one lowercase letter, and one number");
        }

        // Create user
        userService.createUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok("Account created successfully");
    }



    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest request) throws NoSuchAlgorithmException {
        // Validate request
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        // Authenticate user
        boolean isAuthenticated = userService.authenticateUser(request.getUsername(), request.getPassword());

        boolean isNotLocked = userService.handleLoginAttempts(request.getUsername(), isAuthenticated);

//        System.out.println(request.getUsername() + request.getPassword());
//        System.out.println(isNotLocked);
//        System.out.println(isAuthenticated);


        // Check if the user is locked out
        if (!isNotLocked) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Unsuccessful, You are locked out. Please try again after 30 seconds.");
        }
        else if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login Unsuccessful, Invalid username or password");
        }
    }

}

