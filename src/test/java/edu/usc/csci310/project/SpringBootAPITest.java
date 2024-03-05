package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SpringBootAPITest {
    private SpringBootAPI springBootAPI = new SpringBootAPI();

    @Test
    public void testMainMethod() {
        String[] args = {"arg1", "arg2"};
        springBootAPI.main(args);
    }

    @Test
    public void testRedirect(){
        String forward = springBootAPI.redirect();
        assertEquals("forward:/", forward);
    }
}


