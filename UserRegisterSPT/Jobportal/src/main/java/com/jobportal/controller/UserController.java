package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jobportal.entity.User;
import com.jobportal.service.UserService;
import com.jobportal.service.EmailService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    // ✅ REGISTER
    @PostMapping("/register")
    public Object registerUser(@RequestBody User user){
        try {
            return userService.saveUser(user);
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Object loginUser(@RequestBody User user){
        try {
            return userService.login(user.getEmail(), user.getPassword());
        } catch (Exception e) {
            return e.getMessage();
        }
    }

    // ✅ EMAIL TEST
    @GetMapping("/testmail")
    public String testMail() {
        emailService.sendEmail(
            "pindiavinash07@gmail.com",
            "Test Mail",
            "Hello from Spring Boot"
        );
        return "Mail sent successfully!";
    }
}