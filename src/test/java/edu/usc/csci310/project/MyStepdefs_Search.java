package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

public class MyStepdefs_Search {

    private static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();
    private static boolean accountCreated = false;

    private void createAccount() throws InterruptedException{
        accountCreated = true;
        driver.get(ROOT_URL + "create");
        //username
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[1]/input")).sendKeys("testuser");
        //password
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[2]/input")).sendKeys("testPassword1");
        //confirm password
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[3]/input")).sendKeys("testPassword1");
        //click create account
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/button[1]")).click();
        //wait for redirect to login
        Thread.sleep(1000);
    }

    @Given("I am on the search page")
    public void iAmOnTheSearchPage() throws InterruptedException {
        System.out.println("Account created:"+accountCreated);
        if (!accountCreated) {
            createAccount();
        } else {
            driver.get(ROOT_URL + "login");
        }
        //login username
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[1]/input")).sendKeys("testuser");
        //login password
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[2]/input")).sendKeys("testPassword1");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/button[1]")).click();
        Thread.sleep(1000);

    }
    @After
    public void after(){
        driver.quit();
    }

    @And("I click the dropdown Name")
    public void iClickTheDropdownName() {
        driver.findElement(By.xpath("/html/body/div/div/div[2]/div[2]/form/div[2]/div[1]/div/input")).click();

    }


    @And("I click the dropdown State")
    public void iClickTheDropdownState() {
        driver.findElement(By.xpath("//*[@id=\"searchByState\"]")).click();

    }

    @When("I enter {string} in the search bar")
    public void iEnterInTheSearchBar(String arg0) {
        driver.findElement(By.xpath("/html/body/div/div/div[2]/div[2]/form/div[1]/div[1]/input")).sendKeys(arg0);
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
    ///html/body/div/div/div/div[2]/form/div[2]/div[1]/div/label
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

    @Then("List of parks such as {string}")
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
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.findElement(By.xpath("/html/body/div/div/div[2]/div[2]/form/div[1]/div[2]/button")).click();


    }

    @And("I click on {string} and see details")
    public void iClickOnAndSeeDetails(String arg0) {
        WebElement parkElement = driver.findElement(By.xpath("//h3[text()='" + arg0 + "']"));
        parkElement.click();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    @Then("I see Location state {string}")
    public void iSeeLocationState(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }


    @Then("I see Entrance Fee {string}")
    public void iSeeEntranceFee(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I see Entrance Fee Description {string}")
    public void iSeeEntranceFeeDescription(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I see Description {string}")
    public void iSeeDescription(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I see Activities {string}")
    public void iSeeActivities(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }


    @Then("I see Amenities {string}")
    public void iSeeAmenities(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }


    @Then("I see Image alt-ID {string}")
    public void iSeeImageAltID(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I press enter")
    public void iPressEnter() {

        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/form/div[1]/div[2]/button")).sendKeys(Keys.ENTER);
    }

    @Then("I see {string}")
    public void iSee(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @Then("I should not see {string}")
    public void iShouldNotSee(String arg0) {
        assertFalse(driver.getPageSource().contains(arg0));
    }

    @And("I hover over {string} container")
    public void iHoverOverContainer(String arg0) {
        WebElement parkNameDiv = driver.findElement(By.id("expand"));
        Actions actions = new Actions(driver);
        actions.moveToElement(parkNameDiv).perform();
    }

    @Then("I click the plus button")
    public void iClickThePlusButton() {
        WebElement plusButton = driver.findElement(By.id("plus"));
        plusButton.click();
    }

    @Then("I should get an alert saying {string}")
    public void iShouldGetAnAlertSaying(String arg0) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.findElement(By.xpath("/html/body/div/div/div[1]")).isDisplayed();
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("{string} is already in my favorites")
    public void isAlreadyInMyFavorites(String arg0) {
        iHoverOverContainer(arg0);
        iClickThePlusButton();
    }

    @Then("I click URL")
    public void iClickURL() {
        driver.findElement(By.id("url")).click();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("tab opened should be {string}")
    public void tapOpenedShouldBe(String arg0) {
        ArrayList<String> tabs = new ArrayList<>(driver.getWindowHandles());
        driver.switchTo().window(tabs.get(1));
        String currentUrl = driver.getCurrentUrl();

        assertEquals(arg0, currentUrl);

    }

    @And("I click on {string} on navbar")
    public void iClickOnOnNavbar(String arg0) {
        WebElement searchElement = driver.findElement(By.linkText(arg0));
        searchElement.click();
    }

    @Then("I should be on the {string} page")
    public void iShouldBeOnThePage(String arg0) {
        String currentUrl = driver.getCurrentUrl();
        String expectedUrl = ROOT_URL+arg0;

    }

    @Then("I wait a little")
    public void iWaitALittle() {
        iClickThePlusButton();
        iClickThePlusButton();
    }

    @And("I click the Load More button")
    public void iClickTheLoadMoreButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement loadElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(" //*[@id=\"root\"]/div/div/div[14]/div/button")));
        try {
            loadElement.click();
        } catch (ElementClickInterceptedException e) {
            // If the element is still not clickable after scrolling, there might be an overlay
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loadElement);
            loadElement.click();
        }
    }

    @And("I click the Load More button for Activity")
    public void iClickTheLoadMoreButtonForActivity() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement loadElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(" //*[@id=\"root\"]/div/div/div[5]/div/div/div[11]/div/button")));
        try {
            loadElement.click();
        } catch (ElementClickInterceptedException e) {
            // If the element is still not clickable after scrolling, there might be an overlay
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loadElement);
            loadElement.click();
        }
    }

    @And("I click the Load More button for Amenity")
    public void iClickTheLoadMoreButtonForAmenity() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement loadElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("  //*[@id=\"root\"]/div/div/div[4]/div/div/div[11]/div/button")));
        try {
            loadElement.click();
        } catch (ElementClickInterceptedException e) {
            // If the element is still not clickable after scrolling, there might be an overlay
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loadElement);
            loadElement.click();
        }
    }

    @And("I click the Load More button two more times")
    public void iClickTheLoadMoreButtonTwoMoreTimes() {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds timeout
        WebElement loadElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(" //*[@id=\"root\"]/div/div/div[5]/div/div/div[11]/div/button")));
        try {
            loadElement.click();
            loadElement.click();
        } catch (ElementClickInterceptedException e) {
            // If the element is still not clickable after scrolling, there might be an overlay
            ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", loadElement);
            loadElement.click();
        }

    }

    @When("I click on the state code")
    public void iClickOnTheStateCode() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        driver.findElement(By.xpath("html/body/div/div/div[2]/div/div[4]/div/div[2]/p[1]/a")).click();

    }



//
//    @Then("I hover over the {string} and see search description")
//    public void iHoverOverTheAndSeeSearchDescription(String arg0) {
//    }
}
