package edu.usc.csci310.project;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class FavoriteTest {

    @Test
    void testAddFavoritePark() {
        Favorite favorite = new Favorite("testUser");
        favorite.addFavoritePark("ABC123");

        List<String> expected = new ArrayList<>();
        expected.add("ABC123");

        assertEquals(expected, favorite.getFavoriteParks());
    }

    @Test
    void testRemoveFavoritePark() {
        Favorite favorite  = new Favorite();
        favorite.setUsername("testUser");

        favorite.addFavoritePark("ABC123");
        favorite.addFavoritePark("XYZ456");
        favorite.removeFavoritePark("ABC123");

        List<String> expected = new ArrayList<>();
        expected.add("XYZ456");

        assertEquals(expected, favorite.getFavoriteParks());
    }

    @Test
    void testGetFavoriteParks() {
        Favorite favorite = new Favorite("testUser");
        favorite.addFavoritePark("ABC123");
        favorite.addFavoritePark("XYZ456");

        List<String> expected = new ArrayList<>();
        expected.add("ABC123");
        expected.add("XYZ456");

        assertEquals(expected, favorite.getFavoriteParks());
    }

    @Test
    void testSetFavoriteParks() {
        Favorite favorite = new Favorite("testUser");
        List<String> parks = new ArrayList<>();
        parks.add("ABC123");
        parks.add("XYZ456");
        favorite.setFavoriteParks(parks);

        assertEquals(parks, favorite.getFavoriteParks());
    }

    @Test
    void testGetUsername() {
        Favorite favorite = new Favorite("testUser");

        assertEquals("testUser", favorite.getUsername());
    }

    @Test
    void testSetUsername() {
        Favorite favorite = new Favorite("testUser");
        favorite.setUsername("newUser");

        assertEquals("newUser", favorite.getUsername());
    }

    @Test
    void testIsPublic() {
        Favorite favorite = new Favorite("testUser");

        assertFalse(favorite.isPublic());//default is private
    }

    @Test
    void testSetPublic() {
        Favorite favorite = new Favorite("testUser");
        favorite.setPublic(false);

        assertFalse(favorite.isPublic());
    }
    @Test
    void testParkRankings() {
        Favorite favorite = new Favorite("testUser");
        Map<String, Integer> parkRankings = new HashMap<>();
        parkRankings.put("ABC123", 5);
        parkRankings.put("XYZ456", 3);
        favorite.setParkRankings(parkRankings);

        assertEquals(parkRankings, favorite.getParkRankings());
    }


    @Test
    void testParkRankingsGetterAndSetter() {
        // Create a Favorite instance
        Favorite favorite = new Favorite("testUser");

        // Create a sample park rankings map
        Map<String, Integer> parkRankings = new HashMap<>();
        parkRankings.put("ABC123", 5);
        parkRankings.put("XYZ456", 3);

        // Set the park rankings map using the setter
        favorite.setParkRankings(parkRankings);

        // Get the park rankings map using the getter
        Map<String, Integer> retrievedParkRankings = favorite.getParkRankings();

        // Assert that the retrieved map is the same as the original one
        assertEquals(parkRankings, retrievedParkRankings);
    }
}
