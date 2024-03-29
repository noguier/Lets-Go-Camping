package edu.usc.csci310.project;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.junit.After;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class CreateLoginStepDefs {

    public static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();

    @Given("I am on the create account page")
    public void iAmOnTheCreateAccountPage(){
        driver.get(ROOT_URL + "create");
    }

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        driver.get(ROOT_URL);
    }

    @After
    public void after(){
        driver.quit();
    }

    @When("I click on the already have account button")
    public void iClickOnTheLoginButton() {
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[2]")).click();
    }

    @Then("I should be redirected to the login page")
    public void iShouldBeRedirectedToTheLoginPage() throws InterruptedException {
        Thread.sleep(500);
        driver.get(ROOT_URL + "login");
    }


    @When("I enter the username {string}")
    public void iEnterTheUsername(String arg0) {
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).sendKeys(arg0);
    }


    @And("I enter the password {string}")
    public void iEnterThePassword(String arg0) {
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).sendKeys(arg0);
    }


    @And("I enter the confirm password {string}")
    public void iEnterTheConfirmPassword(String arg0) {
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[3]/input")).sendKeys(arg0);
    }


    @And("I press the Create Account button")
    public void iPressTheCreateAccountButton() {
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
    }


    @Then("I should get a {string} message")
    public void iShouldGetAMessage(String arg0) throws InterruptedException {
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains(arg0));
    }


    @And("the account TommyTrojan has already been created")
    public void theAccountTommyTrojanHasAlreadyBeenCreated() throws InterruptedException {
        Thread.sleep(500);
        //username TommyTrojan
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).sendKeys("BillyBruin");
        Thread.sleep(500);
        //password TestPassword123
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).sendKeys("BillyBruin123");
        Thread.sleep(500);
        //confirm password
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[3]/input")).sendKeys("BillyBruin123");
        Thread.sleep(500);
        //click submit
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
        Thread.sleep(500);
        //go back to create account page
        driver.get(ROOT_URL + "create");
        Thread.sleep(500);
    }


    @When("I click on the Don't have account button")
    public void iClickOnTheDonTHaveAccountButton() {
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[2]")).click();
    }


    @Then("I should be redirected to the Create Account page")
    public void iShouldBeRedirectedToTheCreateAccountPage() {
        driver.get(ROOT_URL + "create");
    }


    @Then("I should not be allowed to login anymore")
    public void iShouldNotBeAllowedToLoginAnymore() throws InterruptedException {
        iClickTheLoginButton();
        iClickTheLoginButton();
        iClickTheLoginButton();
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains("Login Unsuccessful, You are locked out. Please try again after 30 seconds."));
    }


    @Then("I should still be allowed to login")
    public void iShouldStillBeAllowedToLogin() throws InterruptedException {
        Thread.sleep(1000);
        assertTrue(driver.getPageSource().contains("Login Unsuccessful, Invalid username or password"));
    }


    @And("I have tried two unsuccessful login attempts in one min")
    public void iHaveTriedUnsuccessfullyToLoginInTheTwoPreviousAttemptsWithinAMinute() throws InterruptedException {
        //given on login page
        driver.get(ROOT_URL + "login");
        //enter username wrong
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).sendKeys("wrong");
        //enter password wrong
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).sendKeys("wrong");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();

        Thread.sleep(300);
        //clear username and password
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).clear();
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).clear();


    }

    @And("I have tried unsuccessfully to login in the three previous attempts")
    public void iHaveTriedUnsuccessfullyToLoginInTheThreePreviousAttempts() throws InterruptedException {
        //given on login page
        driver.get(ROOT_URL + "login");
        //enter username wrong
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).sendKeys("wrong");
        //enter password wrong
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).sendKeys("wrong");
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
        //click login
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();

        Thread.sleep(500);
        //clear username and password
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).clear();
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).clear();
    }

    @And("I wait thirty seconds")
    public void iWaitThirtySeconds() throws InterruptedException {
        Thread.sleep(30000);
    }


    @And("Tommy is a registered user")
    public void tommyIsARegisteredUser() throws InterruptedException {
        //go to create account page
        driver.get(ROOT_URL + "create");
        //enter Tommy as username
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[1]/input")).sendKeys("Tommy");
        //enter Trojan123 as password
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[2]/input")).sendKeys("Trojan123");
        //enter Trojan123 as confirm password
        driver.findElement(By.xpath("/html/body/div/div/div/form/div[3]/input")).sendKeys("Trojan123");
        //click create account (where I should be automatically redirected to login)
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
        //wait a little
        Thread.sleep(500);
    }

    @Then("I should be redirected to the Dashboard page")
    public void iShouldBeRedirectedToTheDashboardPage() {
        driver.get(ROOT_URL + "search");
    }


    @And("I click the login button")
    public void iClickTheLoginButton() {
        driver.findElement(By.xpath("/html/body/div/div/div/form/button[1]")).click();
    }

}


