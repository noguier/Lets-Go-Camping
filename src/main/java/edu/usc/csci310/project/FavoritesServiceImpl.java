package edu.usc.csci310.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
@Service
public class FavoritesServiceImpl implements FavoritesService {

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Override
    public boolean addFavoritePark(String username, String parkCode) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            List<String> favoriteParks = favorite.getFavoriteParks();
            if (!favoriteParks.contains(parkCode)) {
                favoriteParks.add(parkCode);
                favorite.setFavoriteParks(favoriteParks);
                favoritesRepository.save(favorite);
                return true;
            } else {
                // Park already exists in the favorite list
                return false;
            }
        } else {
            // Create a new favorite list for the user
            Favorite newFavorite = new Favorite(username);
            newFavorite.addFavoritePark(parkCode);
            favoritesRepository.save(newFavorite);
            return true;
        }
    }

    @Override
    public boolean removeFavoritePark(String username, String parkCode) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            List<String> favoriteParks = favorite.getFavoriteParks();
            if (favoriteParks.contains(parkCode)) {
                favoriteParks.remove(parkCode);
                favorite.setFavoriteParks(favoriteParks);
                favoritesRepository.save(favorite);
                return true;
            } else {
                // Park doesn't exist in the favorite list
                return false;
            }
        } else {
            // User's favorite list doesn't exist
            return false;
        }
    }

    //this method will help with compare and suggest
    //this method will find the favorite list from username
    @Override
    public List<String> getFavoriteParksByUsername(String username) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            return favorite.getFavoriteParks();
        } else {
            // User's favorite list doesn't exist
            System.out.println("DEBUG: EMPTY LIST");
            return Collections.emptyList();
        }
    }

    @Override
    public void togglePrivacy(String username, boolean isPublic) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            favorite.setPublic(isPublic);
            favoritesRepository.save(favorite);
        }
    }


}
