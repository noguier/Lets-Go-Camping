package edu.usc.csci310.project;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class https_StepDefs {
    protected static final String ROOT_URL = "http://localhost:8080/";
    protected WebDriver driver;
    @Given("I try to access our landing page with http")
    public void iTryToAccessHttpLocalhost() {
        driver = new ChromeDriver();
        driver.get(ROOT_URL);
    }

    @Then("the server should reject the connection")
    public void theServerShouldRejectTheConnection() {
        assertTrue(driver.getPageSource().contains("This combination of host and port requires TLS."));
    }
}
