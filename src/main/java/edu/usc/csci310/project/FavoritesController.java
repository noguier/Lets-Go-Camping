package edu.usc.csci310.project;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;


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
//            System.out.println("Username:" + username);
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


    @GetMapping("/display")
    public List<String> displayFavorites(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        String username = (String) session.getAttribute("username");
        System.out.println("Debug: USERNAME:"+ username);

        List<String> list = favoritesService.getFavoriteParksByUsername(username);
        System.out.println("list:\n" + list);
        return list;
    }

    @GetMapping("/display/{username}")
    public ResponseEntity<List<String>> displayFavoritesPerUser(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.emptyList());
        }
        List<String> list = favoritesService.getFavoriteParksByUsername(username);
        if (list == null || list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/privacy/{username}")
    public ResponseEntity<Boolean> getPrivacyStatus(@PathVariable String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        boolean isPublic = favoritesService.isPublic(username);
        return ResponseEntity.ok(isPublic);
    }
    @GetMapping("/privacy")
    public ResponseEntity<Boolean> privacyStatus(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);

        String username = (String) session.getAttribute("username");
        boolean isPublic = favoritesService.isPublic(username);
        return ResponseEntity.ok(isPublic);
    }

    @GetMapping("/ranking/{parkCode}")
    public ResponseEntity<Integer> getParkRanking(HttpServletRequest httpRequest, @PathVariable String parkCode) {
        try {
            HttpSession session = httpRequest.getSession(false);
            // Call the service layer method to get the park ranking
            String username = (String) session.getAttribute("username");
            int ranking = favoritesService.getParkRanking(username,parkCode);
//            System.out.println("DEBUG CONTROLLER: PARK RANKING" + ranking );
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/ranking/{username}/{parkCode}")
    public ResponseEntity<Integer> getParkRanking(HttpServletRequest httpRequest, @PathVariable String username,@PathVariable String parkCode) {
        try {
            HttpSession session = httpRequest.getSession(false);
            // Call the service layer method to get the park ranking
            int ranking = favoritesService.getParkRanking(username,parkCode);
            System.out.println("DEBUG CONTROLLER: PARK RANKING" + ranking );
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/togglePrivacy")
    public ResponseEntity<String> togglePrivacy(@RequestBody Map<String, Boolean> requestBody, HttpServletRequest httpRequest) {
        Boolean isPublic = requestBody.get("isPublic");

        HttpSession session = httpRequest.getSession(false);
        String username = (String) session.getAttribute("username");


        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            favoritesService.togglePrivacy(username, isPublic);
            System.out.println("DEBUG:PUBLIC:" + isPublic);
            //need to send an updated part of updated piece of code
            return ResponseEntity.ok("Privacy setting updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update privacy setting");
        }
    }
    @PostMapping("/updateRanking")
    public ResponseEntity<String> updateParkRanking(@RequestBody Map<String, Object> requestBody, HttpServletRequest httpRequest) {
        String parkCode = (String) requestBody.get("parkCode");
        Integer newRanking = (Integer) requestBody.get("newRanking");

        HttpSession session = httpRequest.getSession(false);
        String username = (String) session.getAttribute("username");

        if (session.getAttribute("username") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            favoritesService.updateParkRanking(username, parkCode, newRanking);
            return ResponseEntity.ok("Park ranking updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update park ranking");
        }
    }


}
