package edu.usc.csci310.project;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach; // Import BeforeEach
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.sql.*;

public class UserTest {

    static PreparedStatement prepState;
    static Connection mockConnection;
    static ResultSet result;
    static Statement statement;

//    private Park park;
//    private Park park2;
//    private User user;
//
//    private List<Park> fav;

    private User user;

    private User user2;

    @BeforeAll
    public static void setUpMocks() throws Exception {
        try {
            // Mocking PreparedStatement
            prepState = mock(PreparedStatement.class);

            // Mocking Connection
            mockConnection = mock(Connection.class);
            when(mockConnection.prepareStatement(anyString())).thenReturn(prepState);

            // Mocking ResultSet
            result = mock(ResultSet.class);
            when(prepState.executeQuery()).thenReturn(result);

            // Mocking Statement
            statement = mock(Statement.class);
            when(mockConnection.createStatement()).thenReturn(statement);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @BeforeEach
    public void setUp() {
        // Initialize the User and Park objects as needed before each test method
        user = new User("username", "email@example.com", "password");
//        park = new Park("Park Name", "City", "County", "State", "URL", 10.0, "PictureURL",
//                "Description", "Amenities", false);
//        park2 = new Park("Park Name", "City", "County", "State", "URL", 10.0, "PictureURL",
//                "Description", "Amenities", false);
//        //create a list of fav parks
//        fav = new ArrayList<>();
//        fav.add(park);
//        fav.add(park2);

        //user2 = new User("username", "email@gmail.com", "hi123", fav);

    }

//    @Test
//    public void testAddFavoritePark() {
//        // Test adding a favorite park to the user
//        user.addFavoritePark(park);
//        assertTrue(user.getFavoriteParks().contains(park));
//    }
//
//    @Test
//    public void testRemoveFavoritePark() {
//        // Test removing a favorite park from the user
//        user.addFavoritePark(park);
//        assertTrue(user.getFavoriteParks().contains(park));
//
//        user.removeFavoritePark(park);
//        assertFalse(user.getFavoriteParks().contains(park));
//    }

    @Test
    public void testSetUsername() {
        user.setUsername("hi");
        assertEquals("hi", user.getUsername());
    }

    @Test
    public void testSetEmail() {
        user.setEmail("hi@usc.edu");
        assertEquals("hi@usc.edu", user.getEmail());
    }

    @Test
    public void testSetPassword() {
        user.setPassword("12345Hi");
        assertEquals("12345Hi", user.getPassword());
    }

//    @Test
//    public void testConstructorWithFavoriteParks() {
//        assertNotNull(user2.getFavoriteParks());
//        assertEquals(2, user2.getFavoriteParks().size());
//    }


}

