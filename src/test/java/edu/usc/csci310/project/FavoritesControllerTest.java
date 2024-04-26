package edu.usc.csci310.project;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Collections;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FavoritesControllerTest {

    @Mock
    private FavoritesService favoritesService;

    @InjectMocks
    private FavoritesController favoritesController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addFavoritePark_UserNotAuthenticated_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void addFavoritePark_SuccessfullyAdded_ReturnsOk() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.addFavoritePark("testUser", "ABC123")).thenReturn(true);

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void addFavoritePark_AlreadyAdded_ReturnsBadRequest() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.addFavoritePark("testUser", "ABC123")).thenReturn(false);

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_UserNotAuthenticated_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_SuccessfullyRemoved_ReturnsOk() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.removeFavoritePark("testUser", "ABC123")).thenReturn(true);

        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_NotFound_ReturnsBadRequest() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.removeFavoritePark("testUser", "ABC123")).thenReturn(false);

        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void addFavoritePark_ExceptionThrown_ReturnsInternalServerError() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.addFavoritePark("testUser", "ABC123")).thenThrow(new RuntimeException("Some error"));

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_ExceptionThrown_ReturnsInternalServerError() throws Exception {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.removeFavoritePark("testUser", "ABC123")).thenThrow(new RuntimeException("Some error"));

        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void addFavoritePark_NullSession_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getSession(false)).thenReturn(null);

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void addFavoritePark_NullUsername_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        ResponseEntity<String> response = favoritesController.addFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_NullSession_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getSession(false)).thenReturn(null);

        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void removeFavoritePark_NullUsername_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);
        ResponseEntity<String> response = favoritesController.removeFavoritePark("ABC123=", request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }


    @Test
    void togglePrivacy_UserNotAuthenticated_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        Map<String, Boolean> payload = Collections.singletonMap("isPublic", true);

        ResponseEntity<String> response = favoritesController.togglePrivacy(payload, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(favoritesService, never()).togglePrivacy(anyString(), anyBoolean());
    }

    @Test
    void togglePrivacy_SuccessfullyToggled_ReturnsOk() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");

        Map<String, Boolean> payload = Collections.singletonMap("isPublic", true);

        ResponseEntity<String> response = favoritesController.togglePrivacy(payload, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(favoritesService, times(1)).togglePrivacy("testUser", true);
    }

    @Test
    void togglePrivacy_ExceptionThrown_ReturnsInternalServerError() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        doThrow(new RuntimeException("Some error")).when(favoritesService).togglePrivacy(anyString(), anyBoolean());

        Map<String, Boolean> payload = Collections.singletonMap("isPublic", true);

        ResponseEntity<String> response = favoritesController.togglePrivacy(payload, request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(favoritesService, times(1)).togglePrivacy("testUser", true);
    }

    @Test
    void togglePrivacy_NullUsername_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        Map<String, Boolean> payload = Collections.singletonMap("isPublic", true);

        ResponseEntity<String> response = favoritesController.togglePrivacy(payload, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(favoritesService, never()).togglePrivacy(anyString(), anyBoolean());
    }


    @Test
    void displayFavorites_UserNotAuthenticated_ReturnsUnauthorized() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        // Act
        List<String> response = favoritesController.displayFavorites(request);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.size());
    }

    @Test
    void displayFavorites_UserAuthenticated_ReturnsListOfFavoriteParks() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");

        // Mocking favorite parks for the test user
        List<String> favoriteParks = Arrays.asList("ABC123", "DEF456", "GHI789");
        when(favoritesService.getFavoriteParksByUsername("testUser")).thenReturn(favoriteParks);

        // Act
        List<String> response = favoritesController.displayFavorites(request);

        // Assert
        assertEquals(favoriteParks, response);
    }


    @Test
    void displayFavorites_NullUsername_ReturnsUnauthorized() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        // Act
        List<String> response = favoritesController.displayFavorites(request);

        // Assert
        assertNotNull(response);
        assertEquals(0, response.size());
    }
    @Test
    void updateParkRanking_UserNotAuthenticated_ReturnsUnauthorized() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        // Act
        ResponseEntity<String> response = favoritesController.updateParkRanking(Collections.emptyMap(), request);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(favoritesService, never()).updateParkRanking(any(), any(), anyInt());
    }

    @Test
    void updateParkRanking_SuccessfullyUpdated_ReturnsOk() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");

        // Mocking request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("parkCode", "ABC123");
        requestBody.put("newRanking", 5);

        // Act
        ResponseEntity<String> response = favoritesController.updateParkRanking(requestBody, request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(favoritesService, times(1)).updateParkRanking("testUser", "ABC123", 5);
    }

    @Test
    void updateParkRanking_ExceptionThrown_ReturnsInternalServerError() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        doThrow(new RuntimeException("Some error")).when(favoritesService).updateParkRanking(any(), any(), anyInt());

        // Mocking request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("parkCode", "ABC123");
        requestBody.put("newRanking", 5);

        // Act
        ResponseEntity<String> response = favoritesController.updateParkRanking(requestBody, request);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(favoritesService, times(1)).updateParkRanking("testUser", "ABC123", 5);
    }

    @Test
    void updateParkRanking_NullUsername_ReturnsUnauthorized() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        // Mocking request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("parkCode", "ABC123");
        requestBody.put("newRanking", 5);

        // Act
        ResponseEntity<String> response = favoritesController.updateParkRanking(requestBody, request);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(favoritesService, never()).updateParkRanking(any(), any(), anyInt());
    }
    @Test
    void displayFavoritesPerUser_NullOrEmptyUsername() {
        ResponseEntity<List<String>> response = favoritesController.displayFavoritesPerUser("");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().isEmpty(), "Expected empty list for bad request response");

        response = favoritesController.displayFavoritesPerUser(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().isEmpty(), "Expected empty list for bad request response");
    }

    @Test
    void displayFavoritesPerUser_EmptyFavoritesList() {
        String username = "testUser";
        when(favoritesService.getFavoriteParksByUsername(username)).thenReturn(Collections.emptyList());

        ResponseEntity<List<String>> response = favoritesController.displayFavoritesPerUser(username);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().isEmpty(), "Expected empty list when no favorites found");
    }

    @Test
    void displayFavoritesPerUser_FavoritesExist() {
        String username = "testUser";
        List<String> expectedFavorites = Arrays.asList("Park1", "Park2");
        when(favoritesService.getFavoriteParksByUsername(username)).thenReturn(expectedFavorites);

        ResponseEntity<List<String>> response = favoritesController.displayFavoritesPerUser(username);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedFavorites, response.getBody(), "Expected list of favorites to be returned");
    }

    @Test
    void displayFavoritesPerUser_NullFavoritesList() {
        String username = "testUser";
        when(favoritesService.getFavoriteParksByUsername(username)).thenReturn(null);

        ResponseEntity<List<String>> response = favoritesController.displayFavoritesPerUser(username);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().isEmpty(), "Expected empty list when favorites list is null");
    }

    @Test
    void getPrivacyStatus_NullOrEmptyUsername() {
        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody(), "Expected null body for bad request response");

        response = favoritesController.getPrivacyStatus("");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody(), "Expected null body for bad request response");

        response = favoritesController.getPrivacyStatus("   ");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody(), "Expected null body for bad request response");
    }

    @Test
    void getPrivacyStatus_PublicFavorites() {
        String username = "user1";
        when(favoritesService.isPublic(username)).thenReturn(true);

        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(username);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody(), "Expected true for public favorites");
    }

    @Test
    void getPrivacyStatus_PrivateFavorites() {
        String username = "user2";
        when(favoritesService.isPublic(username)).thenReturn(false);

        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(username);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertFalse(response.getBody(), "Expected false for private favorites");
    }

    @Test
    void privacyStatus_UserAuthenticatedAndIsPublic_ReturnsIsPublicTrue() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.isPublic("testUser")).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = favoritesController.privacyStatus(request);

        // Assert
        assertAll(
                () -> assertEquals(HttpStatus.OK, response.getStatusCode()),
                () -> assertTrue(response.getBody())
        );
    }

    @Test
    void privacyStatus_UserAuthenticatedAndIsNotPublic_ReturnsIsPublicFalse() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.isPublic("testUser")).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = favoritesController.privacyStatus(request);

        // Assert
        assertAll(
                () -> assertEquals(HttpStatus.OK, response.getStatusCode()),
                () -> assertFalse(response.getBody())
        );
    }

    @Test
    void testGetPrivacyStatus_ValidUsername() {
        String username = "user1";
        when(favoritesService.isPublic(username)).thenReturn(true);
        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(username);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody());
    }

    @Test
    void testGetPrivacyStatus_NullUsername() {
        String username = null;
        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(username);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(null, response.getBody());
    }

    @Test
    void testGetPrivacyStatus_EmptyUsername() {
        String username = "";
        ResponseEntity<Boolean> response = favoritesController.getPrivacyStatus(username);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(null, response.getBody());
    }
    @Test
    void getParkRanking_UserAuthenticatedAndRankingExists_ReturnsParkRanking() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.getParkRanking("testUser", "ABC123")).thenReturn(5);

        // Act
        ResponseEntity<Integer> response = favoritesController.getParkRanking(request, "ABC123");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(5, response.getBody());
    }

    @Test
    void getParkRanking_UserAuthenticatedAndRankingDoesNotExist_ReturnsInternalServerError() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");
        when(favoritesService.getParkRanking("testUser", "ABC123")).thenThrow(new RuntimeException());

        // Act
        ResponseEntity<Integer> response = favoritesController.getParkRanking(request, "ABC123");

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void getParkRanking_SuccessfulRetrieval_ReturnsOkWithRanking() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        String username = "testUser";
        String parkCode = "ABC123";
        int expectedRanking = 5;

        when(request.getSession(false)).thenReturn(session); // Assume the session is valid
        when(favoritesService.getParkRanking(username, parkCode)).thenReturn(expectedRanking);

        // Act
        ResponseEntity<Integer> response = favoritesController.getParkRanking(request, username, parkCode);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Integer.valueOf(expectedRanking), response.getBody());
        verify(favoritesService).getParkRanking(username, parkCode);
    }

    @Test
    void getParkRanking_ServiceThrowsException_ReturnsInternalServerError() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        String username = "testUser";
        String parkCode = "DEF456";

        when(request.getSession(false)).thenReturn(session); // Assume the session is valid
        when(favoritesService.getParkRanking(username, parkCode)).thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<Integer> response = favoritesController.getParkRanking(request, username, parkCode);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());
        verify(favoritesService).getParkRanking(username, parkCode);
    }







}
