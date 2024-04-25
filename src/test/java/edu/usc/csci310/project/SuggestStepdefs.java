package edu.usc.csci310.project;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class SuggestStepdefs {
    private static final String ROOT_URL = "http://localhost:8080/";
    private final WebDriver driver = new ChromeDriver();
    @Given("I am on the suggest a park page")
    public void iAmOnTheSuggestAParkPage() throws InterruptedException {
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
        driver.get(ROOT_URL + "compare");
        Thread.sleep(5000);
    }

    @When("I enter a username {string}")
    public void iEnterAUsername(String arg0) throws InterruptedException {
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/div[1]/input")).sendKeys(arg0);



    }

    @And("I click add a user button")
    public void iClickAddAUserButton() throws InterruptedException {
        driver.findElement(By.xpath("/html/body/div/div/div/div[2]/div/div[1]/button")).click();
        Thread.sleep(500);
    }

    @And("that user doesnt exist in the database")
    public void thatUserDoesntExistInTheDatabase() {

    }

    @Then("I should see {string} displayed on the page")
    public void iShouldSeeDisplayedOnThePage(String arg0) {
        Alert alert = driver.switchTo().alert();
        String error = alert.getText();
        System.out.print(arg0);
        System.out.print(error);
        assertTrue(error.contains(arg0));

        alert.accept();

    }
}
