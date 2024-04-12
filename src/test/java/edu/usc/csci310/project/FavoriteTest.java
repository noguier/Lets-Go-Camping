package edu.usc.csci310.project;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

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

        assertTrue(favorite.isPublic());
    }

    @Test
    void testSetPublic() {
        Favorite favorite = new Favorite("testUser");
        favorite.setPublic(false);

        assertFalse(favorite.isPublic());
    }
}
