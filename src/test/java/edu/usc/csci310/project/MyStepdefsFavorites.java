package edu.usc.csci310.project;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.After;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.JavascriptExecutor;

import static org.junit.jupiter.api.Assertions.*;

public class MyStepdefsFavorites {
    public static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();

    @Given("I am now on the favorites page")
    public void iAmNowTheFavoritesPage() throws InterruptedException {
        //go to create account page
        driver.get(ROOT_URL + "create");

        Thread.sleep(1000);
        //enter Tommy as username
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[1]/input")).sendKeys("Tommy");
        //enter Trojan123 as password
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[2]/input")).sendKeys("Trojan123");
        //enter Trojan123 as confirm password
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[3]/input")).sendKeys("Trojan123");
        //click create account (where I should be automatically redirected to login)
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/button[1]")).click();
        //wait a little
        Thread.sleep(500);

        //given on login page
        driver.get(ROOT_URL + "login");
        Thread.sleep(1000);
        //enter username
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[1]/input")).sendKeys("Tommy");
        //enter password
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[2]/input")).sendKeys("Trojan123");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/button[1]")).click();
        Thread.sleep(1000);
        driver.get(ROOT_URL + "search");
        Thread.sleep(5000);

        //*[@id="basic-navbar-nav"]/div/a[3]
        driver.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/a[2]")).click();
        Thread.sleep(500);

    }

    @After
    public void after(){
        driver.quit();
    }
    @And("I have not added any parks to my favorites list")
    public void iHaveNotAddedAnyParksToMyFavoritesList() {
        //do nothing
    }

    @Then("I should see {string}")
    public void iShouldSee(String arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I have added {string} to my favorites list")
    public void iHaveAddedToMyFavoritesList(String arg0) throws InterruptedException {
        //go to search page

        //go to create account page
        driver.get(ROOT_URL + "create");

        Thread.sleep(1000);
        //enter Tommy as username
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[1]/input")).sendKeys("Tommy");
        //enter Trojan123 as password
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[2]/input")).sendKeys("Trojan123");
        //enter Trojan123 as confirm password
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[3]/input")).sendKeys("Trojan123");
        //click create account (where I should be automatically redirected to login)
        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/button[1]")).click();
        //wait a little
        Thread.sleep(500);

        //login
        //given on login page
        driver.get(ROOT_URL + "login");
        Thread.sleep(1000);
        //enter username
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[1]/input")).sendKeys("Tommy");
        //enter password
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[2]/input")).sendKeys("Trojan123");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/button[1]")).click();
        Thread.sleep(1000);
        driver.get(ROOT_URL + "search");
        Thread.sleep(5000);

        //put string in search bar
        driver.findElement(By.id("search-term")).sendKeys(arg0);

        //click the search button
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div[2]/form/div[1]/div[2]/button")).click();
        Thread.sleep(2000);

        //hover over the park
        WebElement parkNameDiv = driver.findElement(By.id("expand"));
        Actions actions = new Actions(driver);
        actions.moveToElement(parkNameDiv).perform();

        //click the plus button
        WebElement plusButton = driver.findElement(By.id("plus"));
        plusButton.click();
    }

    @Then("I should see a list of parks including {string}")
    public void iShouldSeeAListOfParksIncluding(String arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I see a list of parks including {string}")
    public void iSeeAListOfParksIncluding(String arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I click on {string}")
    public void iClickOn(String arg0) {
        WebElement parkElement = driver.findElement(By.xpath("//h3[text()='" + arg0 + "']"));
        parkElement.click();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Then("I see Location {string}")
    public void iSeeLocation(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I hover over {string}")
    public void iHoverOver(String arg0) {
        WebElement parkNameDiv = driver.findElement(By.id("expand"));
        Actions actions = new Actions(driver);
        actions.moveToElement(parkNameDiv).perform();
    }

    @When("I click on the minus button displayed")
    public void iClickOnTheMinusButtonDisplayed() {
        WebElement minusButton = driver.findElement(By.id("plus"));
        minusButton.click();
    }

    @And("I click confirm on the dialogue window that appears")
    public void iClickConfirmOnTheDialogueWindowThatAppears() {
        ((JavascriptExecutor) driver).executeScript("return window.confirm = function(msg) {return true;};");

    }

    @Then("{string} should be removed from my favorites list")
    public void shouldBeRemovedFromMyFavoritesList(String arg0) {
        assertFalse(driver.getPageSource().contains(arg0));
    }

    @And("I click cancel on the dialogue window that appears")
    public void iClickCancelOnTheDialogueWindowThatAppears() {
        ((JavascriptExecutor) driver).executeScript("return window.confirm = function(msg) {return false;};");
    }

    @Then("{string} should be on my favorites list")
    public void shouldBeOnMyFavoritesList(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("my favorites list is not empty")
    public void myFavoritesListIsNotEmpty() throws InterruptedException {
        iHaveAddedToMyFavoritesList("Joshua");
        iHaveAddedToMyFavoritesList("Yellowstone");
    }


    @And("I click on the up arrow")
    public void iClickOnTheUpArrow() {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/ol/li[2]/div/button[1]")).click();
    }

    @Then("I should be able to move the park higher on my favorites list")
    public void iShouldBeAbleToMoveTheParkHigherOnMyFavoritesList() {
        WebElement parkElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/ol/li[1]/div/h3"));
        assertEquals("Park Name", parkElement.getText()); // Update with the expected park name
    }

    @And("I click on the down arrow")
    public void iClickOnTheDownArrow() {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/ol/li[1]/div/button[2]")).click();

    }

    @Then("I should be able to move the park lower on my favorites list")
    public void iShouldBeAbleToMoveTheParkLowerOnMyFavoritesList() {
        WebElement parkElement = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/ol/li[1]/div/h3"));
        assertEquals("Park Name", parkElement.getText()); // Update with the expected park name
    }

    @And("I navigate away from the page")
    public void iNavigateAwayFromThePage() {
        driver.get(ROOT_URL + "search");

    }

    @Then("I should see that my changes are persistent")
    public void iShouldSeeThatMyChangesArePersistent() {
        String empty = "This list is empty";
        assertFalse(driver.getPageSource().contains(empty));
    }

    @And("I see a list of parks such as {string}")
    public void iSeeAListOfParksSuchAs(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @When("I return to the search page")
    public void iReturnToTheSearchPage() {
        driver.get(ROOT_URL + "search");
    }

    @And("I should get a list of parks such as {string}")
    public void iShouldGetAListOfParksSuchAs(String arg0) {
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("I click on the plus button displayed")
    public void iClickOnThePlusButtonDisplayed() {
        WebElement plusButton = driver.findElement(By.id("plus"));
        plusButton.click();
    }

    @And("I return to the favorites page")
    public void iReturnToTheFavoritesPage() {
        driver.get(ROOT_URL + "favorite");
    }

    @When("I click remove all")
    public void iClickRemoveAll() {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/button[2]")).click();
    }

    @Then("My favorites list should be set to private by default")
    public void myFavoritesListShouldBeSetToPrivateByDefault() {
        WebElement privacyButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/button[1]"));
        String buttonText = privacyButton.getText();
        assert buttonText.equals("Private") : "The button does not display 'Private'";
    }

    @And("my list is private")
    public void myListIsPrivate() {
        WebElement privacyButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/button[1]"));
        String buttonText = privacyButton.getText();
        assert buttonText.equals("Private") : "The button does not display 'Private'";
    }

    @And("I toggle the private button")
    public void iToggleThePrivateButton() throws InterruptedException {
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/button[1]")).click();
        Thread.sleep(500);
    }

    @Then("My favorites list should be public")
    public void myFavoritesListShouldBePublic() {
        WebElement privacyButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/button[1]"));
        String buttonText = privacyButton.getText();
        assert buttonText.equals("Public") : "The button does not display 'Public'";
    }
}
