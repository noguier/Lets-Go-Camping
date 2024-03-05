package edu.usc.csci310.project;
import java.util.ArrayList;
import java.util.List;

public class User {
    private String username;
    private String email;
    private String password;

    //Private Park p;
    //private List<Park> favoriteParks;

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        //this.favoriteParks = new ArrayList<Park>(); // Initialize favoriteParks with an empty list
    }

//    public User(String username, String email, String password, List<Park> favoriteParks) {
//        this.username = username;
//        this.email = email;
//        this.password = password;
//        this.favoriteParks = favoriteParks != null ? new ArrayList<>(favoriteParks) : new ArrayList<>();
//    }




    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

//    public List<Park> getFavoriteParks() {
//        return favoriteParks;
//    }
//
//    public void addFavoritePark(Park park) {
//        favoriteParks.add(park);
//    }
//
//    public void removeFavoritePark(Park park) {
//        favoriteParks.remove(park);
//    }
}

