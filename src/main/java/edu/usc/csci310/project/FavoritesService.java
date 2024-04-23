package edu.usc.csci310.project;

import java.util.List;
import java.util.Map;

public interface FavoritesService {

    public boolean addFavoritePark(String username, String parkCode );
    public boolean removeFavoritePark(String username, String parkCode ) throws Exception;

    //this method will help with compare and suggest
    //this method will find the favorite list from username
    List<String> getFavoriteParksByUsername(String username);


    //this method changes from public to private on favorites page
    void togglePrivacy(String username, boolean isPublic);

    void updateParkRanking(String username, String parkCode, int newRanking);


    ///this will get the ranking list, each user has a favorites object
    // in each object there is a map of parks that correlate to its set ranking
    //updated is persistant
    Map<String, Integer> geRankingByUsername(String username);
    boolean isPublic(String username);
}
