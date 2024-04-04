package edu.usc.csci310.project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class SearchController {

    private final String apiKey = "0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd";
    private final String baseUrl = "https://developer.nps.gov/api/v1";

    @GetMapping("/api/parks")
    public Object searchParks(@RequestParam String searchTerm, @RequestParam String searchType) throws IOException {
        String apiUrl = constructApiUrl(searchTerm, searchType);
        URL url = new URL(apiUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        StringBuilder response = new StringBuilder();
        try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
        }

        return response.toString();
    }

    protected String constructApiUrl(String searchTerm, String searchType) {
        String encodedSearchTerm = URLEncoder.encode(searchTerm, StandardCharsets.UTF_8);
        String endpoint = "/parks?q=" + encodedSearchTerm; // Default endpoint for unrecognized search types
        switch (searchType) {
            case "state":
                endpoint = "/parks?stateCode=" + encodedSearchTerm;
                break;
            case "activity":
                endpoint = "/activities/parks?q=" + encodedSearchTerm;
                break;
            case "amenity":
                endpoint = "/amenities/parksplaces?q=" + encodedSearchTerm;
                break;
            //"https://developer.nps.gov/api/v1/amenities/parksplaces?parkCode=olsp&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd"
            case "amenity_parkcode":
                endpoint = "/amenities/parksplaces?parkCode=" + encodedSearchTerm;
                break;
            //`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&limit=1&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd`;
            case "parkClick":
                endpoint = "/parks?parkCode=" + encodedSearchTerm + "&limit=1";
                break;
            default:
                break;
        }
        return baseUrl + endpoint + "&api_key=" + apiKey;
    }
}
