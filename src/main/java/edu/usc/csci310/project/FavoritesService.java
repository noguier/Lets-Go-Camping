package edu.usc.csci310.project;

import java.util.List;

public interface FavoritesService {

    public boolean addFavoritePark(String username, String parkCode );
    public boolean removeFavoritePark(String username, String parkCode ) throws Exception;

    //this method will help with compare and suggest
    //this method will find the favorite list from username
    List<String> getFavoriteParksByUsername(String username);


    //this method changes from public to private on favorites page
    void togglePrivacy(String username, boolean isPublic);

    boolean isPublic(String username);
}
