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

public class StepDef_nav {
    private WebDriver driver;
    private WebDriverWait wait;
    private static final String ROOT_URL = "http://localhost:8080/";
    private static boolean accountCreated = false;

    @Before
    public void setup() {
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 10 seconds wait
    }

//    @Before
//    public void before() throws InterruptedException {
//        //create account
//        //go to create account page
//        driver.get(ROOT_URL + "create");
//        //enter Tommy as username
//        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[1]/input")).sendKeys("Tommy");
//        //enter Trojan123 as password
//        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[2]/input")).sendKeys("Trojan123");
//        //enter Trojan123 as confirm password
//        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/div[3]/input")).sendKeys("Trojan123");
//        //click create account (where I should be automatically redirected to login)
//        driver.findElement(By.xpath("/html/body/div[1]/div/div/div[2]/div/form[2]/button[1]")).click();
//        //wait a little
//        Thread.sleep(500);
//
//        //login
//        //given on login page
//        driver.get(ROOT_URL + "login");
//        //enter username
//        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[1]/input")).sendKeys("Tommy");
//        //enter password
//        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/div[2]/input")).sendKeys("Trojan123");
//        //click login
//        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/form/button[1]")).click();
//    }

    @After
    public void after(){
        driver.quit();
    }

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
