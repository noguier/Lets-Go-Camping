//package edu.usc.csci310.project;
//
//import io.cucumber.java.en.And;
//import io.cucumber.java.en.Given;
//import io.cucumber.java.en.Then;
//import org.junit.After;
//import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//
//public class NavStepDef {
//    public static final String ROOT_URL = "http://localhost:8080/";
//    private final WebDriver driver = new ChromeDriver();
//    @After
//    public void after(){
//        driver.quit();
//    }
//    @Given("I am on the search page")
//    public void iAmOnTheSearchPage(){
//        driver.get(ROOT_URL + "search");
//    }
//    @Given("I am on the Favorites page")
//    public void iAmOnTheFavoritesPage() {
//        driver.get(ROOT_URL + "favorites");
//    }
//    @Given("I am on the Compare and Suggest page")
//    public void iAmOnTheCompareAndSuggestPage(){
//        driver.get(ROOT_URL + "compare");
//    }
//    @And("I click Favorites link")
//    public void iPressFavoritesLink() {
//        driver.findElement(By.xpath("/html/body/div/div/div/div/form/button[2]")).click();
//    }
//
//
//    @Then("I should be redirected to the Compare and Suggest page")
//    public void iShouldBeRedirectedToTheCompareAndSuggestPage() {
//    }
//
//
//    @Then("I should be redirected to the Search page")
//    public void iShouldBeRedirectedToTheSearchPage() {
//    }
//
//    @And("I click Logout link")
//    public void iClickLogoutLink() {
//    }
//
//    @And("I click Compare and suggest link")
//    public void iClickCompareAndSuggestLink() {
//    }
//}
