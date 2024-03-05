package edu.usc.csci310.project;
public class Park {
    private String name;
    private String city;
    private String county;
    private String state;
    private String parkURL;
    private double entranceFee;
    private String pictureURL;
    private String description;
    private String amenities;
    private boolean favorites;

    public Park(String name, String city, String county, String state, String parkURL, double entranceFee,
                String pictureURL, String description, String amenities, boolean favorites) {
        this.name = name;
        this.city = city;
        this.county = county;
        this.state = state;
        this.parkURL = parkURL;
        this.entranceFee = entranceFee;
        this.pictureURL = pictureURL;
        this.description = description;
        this.amenities = amenities;
        this.favorites = favorites;
    }

    // Getters and Setters for all attributes
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getParkURL() {
        return parkURL;
    }

    public void setParkURL(String parkURL) {
        this.parkURL = parkURL;
    }

    public double getEntranceFee() {
        return entranceFee;
    }

    public void setEntranceFee(double entranceFee) {
        this.entranceFee = entranceFee;
    }

    public String getPictureURL() {
        return pictureURL;
    }

    public void setPictureURL(String pictureURL) {
        this.pictureURL = pictureURL;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public boolean isFavorites() {
        return favorites;
    }

    public void setFavorites(boolean favorites) {
        this.favorites = favorites;
    }
}
