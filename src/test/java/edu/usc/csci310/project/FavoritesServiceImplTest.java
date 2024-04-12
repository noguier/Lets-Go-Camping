package edu.usc.csci310.project;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FavoritesServiceImplTest {

    @Mock
    private FavoritesRepository favoritesRepository;

    @InjectMocks
    private FavoritesServiceImpl favoritesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addFavoritePark_NewFavoriteList_Success() {
        String username = "testUser";
        String parkCode = "ABC123";

        when(favoritesRepository.findById(username)).thenReturn(Optional.empty());

        boolean result = favoritesService.addFavoritePark(username, parkCode);

        assertTrue(result);
        verify(favoritesRepository, times(1)).save(any(Favorite.class));
    }

    @Test
    void addFavoritePark_AddNewParkToExistingFavorites_Success() {
        String username = "testUser";
        String parkCode = "ABC123";
        Favorite existingFavorite = new Favorite(username);
        existingFavorite.addFavoritePark("XYZ456");

        when(favoritesRepository.findById(username)).thenReturn(Optional.of(existingFavorite));

        boolean result = favoritesService.addFavoritePark(username, parkCode);

        assertTrue(result);
        assertTrue(existingFavorite.getFavoriteParks().contains(parkCode));
        verify(favoritesRepository, times(1)).save(existingFavorite);
    }

    @Test
    void addFavoritePark_ParkAlreadyExists_ReturnsFalse() {
        String username = "testUser";
        String parkCode = "ABC123";
        Favorite existingFavorite = new Favorite(username);
        existingFavorite.addFavoritePark(parkCode);

        when(favoritesRepository.findById(username)).thenReturn(Optional.of(existingFavorite));

        boolean result = favoritesService.addFavoritePark(username, parkCode);

        assertFalse(result);
        verify(favoritesRepository, never()).save(any());
    }

    @Test
    void removeFavoritePark_ParkExists_Success() {
        String username = "testUser";
        String parkCodeToRemove = "ABC123";
        Favorite existingFavorite = new Favorite(username);
        existingFavorite.addFavoritePark(parkCodeToRemove);

        when(favoritesRepository.findById(username)).thenReturn(Optional.of(existingFavorite));

        boolean result = favoritesService.removeFavoritePark(username, parkCodeToRemove);

        assertTrue(result);
        assertFalse(existingFavorite.getFavoriteParks().contains(parkCodeToRemove));
        verify(favoritesRepository, times(1)).save(existingFavorite);
    }

    @Test
    void removeFavoritePark_ParkDoesNotExist_ReturnsFalse() {
        String username = "testUser";
        String parkCodeToRemove = "ABC123";
        Favorite existingFavorite = new Favorite(username);

        when(favoritesRepository.findById(username)).thenReturn(Optional.of(existingFavorite));

        boolean result = favoritesService.removeFavoritePark(username, parkCodeToRemove);

        assertFalse(result);
        verify(favoritesRepository, never()).save(any());
    }

    @Test
    void removeFavoritePark_UserFavoritesListDoesNotExist_ReturnsFalse() {
        String username = "testUser";
        String parkCodeToRemove = "ABC123";

        when(favoritesRepository.findById(username)).thenReturn(Optional.empty());

        boolean result = favoritesService.removeFavoritePark(username, parkCodeToRemove);

        assertFalse(result);
        verify(favoritesRepository, never()).save(any());
    }

    @Test
    void getFavoriteParksByUsername_UserFavoritesListExists_ReturnsFavoriteParks() {
        String username = "testUser";
        List<String> expectedFavoriteParks = Arrays.asList("ABC123", "XYZ456");
        Favorite existingFavorite = new Favorite(username);
        existingFavorite.setFavoriteParks(expectedFavoriteParks);

        when(favoritesRepository.findById(username)).thenReturn(Optional.of(existingFavorite));

        List<String> result = favoritesService.getFavoriteParksByUsername(username);

        assertEquals(expectedFavoriteParks, result);
    }

    @Test
    void getFavoriteParksByUsername_UserFavoritesListDoesNotExist_ReturnsEmptyList() {
        String username = "testUser";

        when(favoritesRepository.findById(username)).thenReturn(Optional.empty());

        List<String> result = favoritesService.getFavoriteParksByUsername(username);

        assertTrue(result.isEmpty());
    }
}
