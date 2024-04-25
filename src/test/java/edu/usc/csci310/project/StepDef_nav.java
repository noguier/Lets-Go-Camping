package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class StepDef_nav extends SharedStepDefs {


    @And("I click Logout button")
    public void iClickLogoutButton() {
        driver.findElement(By.className("nav4")).click();
    }

    @When("I click the Favorites button")
    public void iClickTheFavoritesButton() {
        driver.findElement(By.className("nav2")).click();
    }

    @And("I click Compare and Suggest button")
    public void iClickCompareAndSuggestButton() {
        driver.findElement(By.className("nav3")).click();
    }

    @Given("I am on the Favorites page")
    public void iAmOnTheFavoritesPage() {
        driver.get(ROOT_URL + "favorites");
    }


    @And("I click Search button")
    public void iClickSearchButton() {
        driver.findElement(By.className("nav1")).click();
    }

    @Then("I should be redirected to the Compare and Suggest page")
    public void iShouldBeRedirectedToTheCompareAndSuggestPage() {
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/compare"));
    }

    @Then("I should be redirected to the Search page")
    public void iShouldBeRedirectedToTheSearchPage() {
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/search"));

    }

    @Given("I am on the Compare and Suggest page")
    public void iAmOnTheCompareAndSuggestPage() {
        driver.get(ROOT_URL + "favorites");
    }
}
