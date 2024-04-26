package edu.usc.csci310.project;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;


public class SharedStepDefs {
    protected static final String ROOT_URL = "https://localhost:8080/";
    protected WebDriver driver;

    protected void beforeSetup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("acceptInsecureCerts");
//        options.addArguments("--headless");
        options.addArguments("--whitelisted-ips");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-extensions");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--ignore-certificate-errors=yes");
        options.addArguments("--ignore-ssl-errors=yes");
        driver = new ChromeDriver(options);

    }
    protected void afterCleanUp() {
        driver.quit();
    }

}
