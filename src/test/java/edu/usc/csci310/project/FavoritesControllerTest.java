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

import static org.junit.jupiter.api.Assertions.assertEquals;
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

}
