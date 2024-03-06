package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class MyStepdefs {
    private static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();
    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage() {
        driver.get(ROOT_URL+"HomePage");
    }

    @After
    public void after() {
        driver.quit();
    }

    @When("I enter the username {string}")
    public void iEnterTheUsername(String arg0) {
        driver.findElement(By.id("username")).sendKeys(arg0);
    }

    @And("I enter the password {string}")
    public void iEnterThePassword(String arg0) {
        driver.findElement(By.id("password")).sendKeys(arg0);
    }

    @And("I press the Create Account button")
    public void iPressTheCreateAccountButton() {
        driver.findElement(By.id("createAccount")).click();
    }

    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String arg0) {
        try{
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        assertTrue(driver.getPageSource().contains(arg0));
    }

    @And("the account {string} has already been created")
    public void theAccountHasAlreadyBeenCreated(String arg0) {
        iEnterTheUsername("ParkEnjoyer");
        iEnterThePassword("Abc_123");
        iPressTheCreateAccountButton();
    }
}
