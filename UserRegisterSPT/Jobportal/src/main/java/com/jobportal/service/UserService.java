package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ✅ REGISTER
    public User saveUser(User user){

        // 🔥 Prevent empty role
        if(user.getRole() == null || user.getRole().isEmpty()){
            user.setRole("USER"); // default
        }

        // 🔥 Prevent duplicate email
        User existing = userRepository.findByEmail(user.getEmail());
        if(existing != null){
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    // ✅ LOGIN
    public User login(String email, String password){

        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new RuntimeException("User not found");
        }

        if(!user.getPassword().equals(password)){
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}