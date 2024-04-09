package edu.usc.csci310.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/favorites")
public class FavoritesController {

    @Autowired
    private FavoritesService favoritesService; // Assuming you have a service layer for favorites

    // Endpoint to add a park to favorites
    @PostMapping("/add")
    public ResponseEntity<String> addFavoritePark(@RequestBody String parkCode, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        //need to get rid of the last letter of all park codes to get rid of '='
        parkCode = parkCode.substring(0, parkCode.length() - 1);

        if (session == null || session.getAttribute("username") == null) {
//            System.out.println("DEBUG:" + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
//        System.out.println("start:3");
        String username = (String) session.getAttribute("username");

        try {
//            System.out.println("start:4");
            System.out.println("Username:" + username);
            boolean result = favoritesService.addFavoritePark(username, parkCode); // Implement this method in your service layer
            if (result) {
                return ResponseEntity.ok("Park added to favorites");
            } else {
                return ResponseEntity.badRequest().body("Park was already added to favorites");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add park to favorites");
        }

       //omg it works
    }

    // Endpoint to remove a park from favorites
    @PostMapping("/remove")
    public ResponseEntity<String> removeFavoritePark(@RequestBody String parkCode, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);

        //need to get rid of the last letter of all park codes to get rid of '='
        parkCode = parkCode.substring(0, parkCode.length() - 1);

        if (session == null || session.getAttribute("username") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String username = (String) session.getAttribute("username");
        try {

            boolean result = favoritesService.removeFavoritePark(username, parkCode); // Implement this method in your service layer
//            System.out.println("Username:" + username);
//            System.out.println("RESULT:" + result);

            if (result) {
                return ResponseEntity.ok("Park removed from favorites");
            } else {
                return ResponseEntity.badRequest().body("Park not found in favorites");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to remove park from favorites");
        }
    }



}
