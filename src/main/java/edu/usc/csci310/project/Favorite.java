package edu.usc.csci310.project;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "favorites")
public class Favorite implements Serializable {

    @Id
    @Column(name = "username")
    private String username;

    @ElementCollection
    @CollectionTable(name = "favorite_parks", joinColumns = @JoinColumn(name = "username"))
    @Column(name = "park_code")
    private List<String> favoriteParks = new ArrayList<>();


    @ElementCollection
    @CollectionTable(name = "park_rankings", joinColumns = @JoinColumn(name = "username"))
    @MapKeyColumn(name = "park_code")
    @Column(name = "ranking")
    private Map<String, Integer> parkRankings = new HashMap<>();
    @Column(name = "is_public")
    private boolean isPublic = false; // Default to private
//    private boolean isPublic = true; // Default to public for debbugging compare and suggest
    public Favorite() {
    }

    public Favorite(String username) {
        this.username = username;
    }

    public void addFavoritePark(String parkCode) {
        favoriteParks.add(parkCode);
    }

    public void removeFavoritePark(String parkCode) {
        favoriteParks.remove(parkCode);
    }

    public List<String> getFavoriteParks() {
        return favoriteParks;
    }

    public void setFavoriteParks(List<String> favoriteParks) {
        this.favoriteParks = favoriteParks;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Map<String, Integer> getParkRankings() {
        return parkRankings;
    }

    public void setParkRankings(Map<String, Integer> parkRankings) {
        this.parkRankings = parkRankings;
    }
}