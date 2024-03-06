package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import javax.lang.model.element.Element;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class MyStepdefs_Search {

    private static final String ROOT_URL = "http://localhost:8080/Search";
    private final WebDriver driver = new ChromeDriver();

    @Given("I am on the search page")
    public void iAmOnTheSearchPage() {
        driver.get(ROOT_URL);
    }
    @After
    public void after(){
        driver.quit();
    }

    @And("I click the dropdown Name")
    public void iClickTheDropdownName() {
        driver.findElement(By.xpath("//*[@id=\"searchByName\"]")).click();

    }


    @And("I click the dropdown State")
    public void iClickTheDropdownState() {
        driver.findElement(By.xpath("//*[@id=\"searchByState\"]")).click();

    }

    @When("I enter {string} in the search bar")
    public void iEnterInTheSearchBar(String arg0) {
        driver.findElement(By.xpath("//*[@id=\"search-term\"]")).sendKeys(arg0);
    }

    @Then("I should get an error message {string}")
    public void iShouldGetAnErrorMessage(String arg0) {
        //error comes in as an alert text box

        Alert alert = driver.switchTo().alert();
        String error = alert.getText();

        assertTrue(error.contains(arg0));

        alert.accept();//closes the alert
    }


    @And("I click the dropdown amenities")
    public void iClickTheDropdownAmenities() {
        driver.findElement(By.xpath("//*[@id=\"searchByAmenity\"]")).click();
    }

    @And("I click the dropdown Activity")
    public void iClickTheDropdownActivity() {
        driver.findElement(By.xpath("//*[@id=\"searchByActivity\"]")).click();
    }

    @Then("I should see {int} park items displayed")
    public void iShouldOnlySeeParkItemsDisplayed(int arg0) {
        WebElement number = driver.findElement(By.xpath("//*[@id=\"park-results\"]/span"));
        int num = Integer.parseInt(number.getText());
        assertTrue(num <= arg0);

    }

    @Then("I should get a list of parks such as {string}")
    public void iShouldGetAListOfParksSuchAs(String arg0) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

//        String name = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[4]/div[1]/h3")).getText();
//        System.out.println("DEBUG: NAME: " + name);
//        assertTrue(name.equals(arg0));

      assertTrue(driver.getPageSource().contains(arg0));

    }

    @Then("I should see the Amenities title for {string}")
    public void iShouldSeeTheAmenitiesTitleFor(String arg0) {
       assertTrue(driver.getPageSource().contains(arg0));

    }

    @Then("I should see the Activities title for {string}")
    public void iShouldSeeTheActivitiesTitleFor(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I click the Search button")
    public void iClickTheSearchButton() {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/form/div[1]/div[2]/button")).click();


    }


//    @And("I click the Load More button")
//    public void iClickTheLoadMoreButton() {
//    }
//
//    @And("I click the Load More button two more times")
//    public void iClickTheLoadMoreButtonTwoMoreTimes() {
//    }
//
//    @Then("I hover over the {string} and see search description")
//    public void iHoverOverTheAndSeeSearchDescription(String arg0) {
//    }
}
