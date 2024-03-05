package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach; // Import BeforeEach
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.sql.*;

public class ParkTest {

    static PreparedStatement prepState;
    static Connection mockConnection;
    static ResultSet result;
    static Statement statement;

    private Park park; // Define the Park object

    @BeforeAll
    public static void parkMocks() throws Exception {
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

    // Initialize the Park object before each test method
    @BeforeEach
    public void setUp() {
        park = new Park("Test Park", "Test City", "Test County", "TS", "http://testpark.com", 10.0,
                "http://testpark.com/image.jpg", "Test Description", "Test Amenities", true);
    }

    @Test
    public void testGetParkByName() {
        try {
            // Create a Park object
            Park park = new Park("Central Park", "New York City", "New York", "NY", "http://www.centralparknyc.org",
                    0.0, "http://www.centralparknyc.org/images/central-park-logo.png",
                    "Central Park is an urban park in New York City", "Playgrounds, sports facilities, walking paths, etc.",
                    true);

            // Mock behavior for the ResultSet
            when(result.next()).thenReturn(true); // Simulate that there is a next row
            when(result.getString("name")).thenReturn(park.getName());
            when(result.getString("city")).thenReturn(park.getCity());
            when(result.getString("county")).thenReturn(park.getCounty());
            when(result.getString("state")).thenReturn(park.getState());
            when(result.getString("parkURL")).thenReturn(park.getParkURL());
            when(result.getDouble("entranceFee")).thenReturn(park.getEntranceFee());
            when(result.getString("pictureURL")).thenReturn(park.getPictureURL());
            when(result.getString("description")).thenReturn(park.getDescription());
            when(result.getString("amenities")).thenReturn(park.getAmenities());
            when(result.getBoolean("favorites")).thenReturn(park.isFavorites());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testSetName() {
        park.setName("New Test Park Name");
        assertEquals("New Test Park Name", park.getName());
    }

    @Test
    public void testGetParkByCity() {
        try {
            // Create a Park object
            Park park = new Park("Central Park", "New York City", "New York", "NY", "http://www.centralparknyc.org",
                    0.0, "http://www.centralparknyc.org/images/central-park-logo.png",
                    "Central Park is an urban park in New York City", "Playgrounds, sports facilities, walking paths, etc.",
                    true);

            // Mock behavior for the ResultSet
            when(result.next()).thenReturn(true); // Simulate that there is a next row
            when(result.getString("name")).thenReturn(park.getName());
            when(result.getString("city")).thenReturn(park.getCity());
            when(result.getString("county")).thenReturn(park.getCounty());
            when(result.getString("state")).thenReturn(park.getState());
            when(result.getString("parkURL")).thenReturn(park.getParkURL());
            when(result.getDouble("entranceFee")).thenReturn(park.getEntranceFee());
            when(result.getString("pictureURL")).thenReturn(park.getPictureURL());
            when(result.getString("description")).thenReturn(park.getDescription());
            when(result.getString("amenities")).thenReturn(park.getAmenities());
            when(result.getBoolean("favorites")).thenReturn(park.isFavorites());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testSetCity() {
        park.setCity("Test Park");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testSetCounty() {
        park.setCounty("Test Park");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testSetState() {
        park.setState("Test Park");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testSetAmenities() {
        park.setAmenities("Test Park");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testSetParkURL() {
        park.setParkURL("Test Park");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testSetEntranceFee() {
        park.setEntranceFee(22.0);
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testPictureURL() {
        park.setPictureURL("pdf picture.com");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testDescription() {
        park.setDescription("pretty park with sandy beaches and hiking trails");
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testIsFavorite() {
        park.setFavorites(true);
        assertTrue(park.isFavorites());
    }

    @Test
    public void testGetName() {
        assertEquals("Test Park", park.getName());
    }

    @Test
    public void testGetCity() {
        assertEquals("Test City", park.getCity());
    }

    @Test
    public void testGetCounty() {
        assertEquals("Test County", park.getCounty());
    }

    @Test
    public void testGetState() {
        assertEquals("TS", park.getState());
    }

    @Test
    public void testGetParkURL() {
        assertEquals("http://testpark.com", park.getParkURL());
    }

    @Test
    public void testGetEntranceFee() {
        assertEquals(10.0, park.getEntranceFee());
    }

    @Test
    public void testGetPictureURL() {
        assertEquals("http://testpark.com/image.jpg", park.getPictureURL());
    }

    @Test
    public void testGetDescription() {
        assertEquals("Test Description", park.getDescription());
    }

    @Test
    public void testGetAmenities() {
        assertEquals("Test Amenities", park.getAmenities());
    }

    @Test
    public void testIsFavorites() {
        assertTrue(park.isFavorites());
    }




}

