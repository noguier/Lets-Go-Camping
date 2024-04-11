package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
public class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testSearchParks() throws Exception {
        String searchTerm = "yose";
        String searchType = "name";
        String constructedUrl = "/api/parks?searchTerm=" + searchTerm + "&searchType=" + searchType;
        System.out.println("DEBUG:"+ constructedUrl);
        mockMvc.perform(MockMvcRequestBuilders.get(constructedUrl)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }
    @Test
    void testConstructApiUrlWithName() throws IOException {
        SearchController searchController = new SearchController();
        String searchTerm = "yose";
        String searchType = "name";
        String expectedUrl = "https://developer.nps.gov/api/v1/parks?q=yose&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd";
        String constructedUrl = searchController.constructApiUrl(searchTerm, searchType);
        assertEquals(expectedUrl, constructedUrl);
    }
    @Test
    void testConstructApiUrlWithState() throws IOException {
        SearchController searchController = new SearchController();
        String searchTerm = "ca";
        String searchType = "state";
        String expectedUrl = "https://developer.nps.gov/api/v1/parks?stateCode=ca&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd";

        String constructedUrl = searchController.constructApiUrl(searchTerm, searchType);

        assertEquals(expectedUrl, constructedUrl);
    }
    @Test
    void testConstructApiUrlWithActivity() throws IOException {
        SearchController searchController = new SearchController();
        String searchTerm = "swimming";
        String searchType = "activity";
        String expectedUrl = "https://developer.nps.gov/api/v1/activities/parks?q=swimming&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd";

        String constructedUrl = searchController.constructApiUrl(searchTerm, searchType);

        assertEquals(expectedUrl, constructedUrl);
    }
    @Test
    void testConstructApiUrlWithAmenity() throws IOException {
        SearchController searchController = new SearchController();
        String searchTerm = "atm";
        String searchType = "amenity";
        String expectedUrl = "https://developer.nps.gov/api/v1/amenities/parksplaces?q=atm&api_key=0CzaOdikn12w2fMosFVNwri9Wl5ckYMz81l58dsd";
        String constructedUrl = searchController.constructApiUrl(searchTerm, searchType);
        assertEquals(expectedUrl, constructedUrl);
    }
}
