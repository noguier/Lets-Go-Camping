package edu.usc.csci310.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

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
            Map<String, Integer> parkRankings = favorite.getParkRankings();

            if (favoriteParks.contains(parkCode)) {
                favoriteParks.remove(parkCode);
                favorite.setFavoriteParks(favoriteParks);

                parkRankings.remove(parkCode);
                reassignParkRankings(parkRankings);

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
    private void reassignParkRankings(Map<String, Integer> parkRankings) {
        int index = 1;
        for (String parkCode : parkRankings.keySet()) {
            parkRankings.put(parkCode, index++);
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
    public boolean isPublic(String username) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);
        return optionalFavorite.map(Favorite::isPublic).orElse(false);
    }


    @Override
    public void updateParkRanking(String username, String parkCode, int newRanking) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            favorite.getParkRankings().put(parkCode, newRanking);
            favoritesRepository.save(favorite);
        }
    }

    ///this will get the ranking list, each user has a favorites object
    // in each object there is a map of parks that correlate to its set ranking
    //updated is persistant
    @Override
    public Map<String, Integer> geRankingByUsername(String username) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);

        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            return favorite.getParkRankings();
        } else {
            return Collections.emptyMap();
        }
    }
    @Override
    public int getParkRanking(String username, String parkCode) {
        Optional<Favorite> optionalFavorite = favoritesRepository.findById(username);
        if (optionalFavorite.isPresent()) {
            Favorite favorite = optionalFavorite.get();
            Map<String, Integer> parkRankings = favorite.getParkRankings();
            System.out.println("DEBUG: PARK RANKING" );
            return parkRankings.getOrDefault(parkCode, 0);
        } else {
            return 0; // Default ranking if the user doesn't have favorites or the park doesn't exist
        }
    }


}
