package edu.usc.csci310.project;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
public class CompareStepDefs extends SharedStepDefs{

    @Given("I am on the compare a park page")
    public void iAmOnTheCompareAParkPage() throws InterruptedException {
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
        driver.findElement(By.xpath("//*[@id=\"basic-navbar-nav\"]/div/a[3]")).click();
        Thread.sleep(500);
    }

//    @After
//    public void after(){
//        driver.quit();
//    }

//    @When("I enter a username {string}")
//    public void iEnterAUsername(String arg0) {
//        WebElement searchInput = driver.findElement(By.xpath("//*[@id='root']/div/div/div[2]/div/div[1]/input"));
//        searchInput.sendKeys(arg0);
//    }


    @And("I click search button")
    public void iClickAddAUserButton()  throws InterruptedException {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div[2]/div/div[1]/button")).click();
        Thread.sleep(1000);

    }
}
