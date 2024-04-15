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

import java.util.Arrays;
import java.util.List;

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

        ResponseEntity<String> response = favoritesController.togglePrivacy(true, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(favoritesService, never()).togglePrivacy(anyString(), anyBoolean());
    }

    @Test
    void togglePrivacy_SuccessfullyToggled_ReturnsOk() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn("testUser");

        ResponseEntity<String> response = favoritesController.togglePrivacy(true, request);

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

        ResponseEntity<String> response = favoritesController.togglePrivacy(true, request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        verify(favoritesService, times(1)).togglePrivacy("testUser", true);
    }


    @Test
    void togglePrivacy_NullUsername_ReturnsUnauthorized() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("username")).thenReturn(null);

        ResponseEntity<String> response = favoritesController.togglePrivacy(true, request);

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
}
