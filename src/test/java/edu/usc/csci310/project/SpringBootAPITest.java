package edu.usc.csci310.project;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ConfigurableApplicationContext;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SpringBootAPITest {
    @Test
    public void testRedirect() {
        SpringBootAPI springBootAPI = new SpringBootAPI();
        assertEquals(springBootAPI.redirect(), "forward:/");
    }
    @Test
    public void testMain() {
        String[] args = {"arg1", "arg2"};
        try (MockedStatic<SpringApplication> staticSpringBootAPI = Mockito.mockStatic(SpringApplication.class)) {
            SpringBootAPI.main(args);
        }
    }
}
