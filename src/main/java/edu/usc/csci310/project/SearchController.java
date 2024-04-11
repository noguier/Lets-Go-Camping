package edu.usc.csci310.project;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;


@RestController
public class SearchController {

    private final String apiKey;

    public SearchController() throws IOException {
        this.apiKey = readApiKeyFromFile();
    }
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
        String endpoint = "/parks?q=" + searchTerm; // Default endpoint for unrecognized search types
        switch (searchType) {
            case "state":
                endpoint = "/parks?stateCode=" + searchTerm;
                break;
            case "activity":
                endpoint = "/activities/parks?q=" + searchTerm;
                break;
            case "amenity":
                endpoint = "/amenities/parksplaces?q=" + searchTerm;
                break;
            default:
                break;
        }
        String baseUrl = "https://developer.nps.gov/api/v1";
        return baseUrl + endpoint + "&api_key=" + apiKey;
    }

    private String readApiKeyFromFile() throws IOException {
        String filePath = "src/main/resources/api.properties.txt";
        byte[] encodedBytes = Files.readAllBytes(Paths.get(filePath));
        return new String(encodedBytes, StandardCharsets.UTF_8).trim();
    }
}
