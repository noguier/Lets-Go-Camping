package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class ProtectedStepdefs  extends SharedStepDefs{

    @And("I am not an authenticated user")
    public void iAmNotAnAuthenticatedUser() {
        driver.navigate().refresh();
    }

    @When("I try to go to the search page")
    public void iTryToGoToTheSearchPage() {
        // Manually navigate to the search page by updating the URL
        driver.get(ROOT_URL + "search");
    }

    @And("I am an authenticated user")
    public void iAmAnAuthenticatedUser() throws InterruptedException {
        //create account
        //go to create account page
        driver.get(ROOT_URL + "create");
        //enter Tommy as username
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[1]/input")).sendKeys("Tommy");
        //enter Trojan123 as password
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[2]/input")).sendKeys("Trojan123");
        //enter Trojan123 as confirm password
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[3]/input")).sendKeys("Trojan123");
        //click create account (where I should be automatically redirected to login)
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/button[1]")).click();
        //wait a little
        Thread.sleep(500);

        //login
        //given on login page
        driver.get(ROOT_URL + "login");
        //enter username wrong
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[1]/input")).sendKeys("Tommy");
        //enter password wrong
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/div[2]/input")).sendKeys("Trojan123");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/div/form/button[1]")).click();
    }

    @When("I click the Go to Favorites button")
    public void iClickTheGoToFavoritesButton() {
        driver.findElement(By.xpath("/html/body/div/div/header/div/nav/div/div/a[2]")).click();
    }

    @Then("I should be redirected to the Favorites page")
    public void iShouldBeRedirectedToTheFavoritesPage() {
        driver.get(ROOT_URL + "favorites");
    }

    @When("I click the Logout button")
    public void iClickTheLogoutButton() {
        driver.findElement(By.xpath("/html/body/div/div/header/div/nav/div/div/a[4]")).click();
    }

    @When("I change the url to {string}")
    public void iChangeTheUrlTo(String arg0) {
        driver.get(ROOT_URL + "arg0");
    }

    @Then("I should be redirected to the create page")
    public void iShouldBeRedirectedToTheCreatePage() {
        driver.get(ROOT_URL + "create");
    }

    @And("I am on the favorites page")
    public void iAmOnTheFavoritesPage() {
        driver.get(ROOT_URL + "favorites");
    }

    @And("I am on the compare page")
    public void iAmOnTheComparePage() {
        driver.get(ROOT_URL + "compare");
    }

    @When("I click the Compare button")
    public void iClickTheCompareButton() {
        driver.findElement(By.xpath("/html/body/div/div/header/div/nav/div/div/a[3]")).click();
    }

    @Then("I should be redirected to the Compare page")
    public void iShouldBeRedirectedToTheComparePage() {
        driver.get(ROOT_URL + "compare");
    }
}
