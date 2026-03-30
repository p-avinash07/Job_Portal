package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jobportal.service.AIInterviewService;

import java.util.Map; // ✅ IMPORTANT

@RestController
@RequestMapping("/ai")
@CrossOrigin("*")
public class AIInterviewController {

    @Autowired
    private AIInterviewService aiService;

    // 🎤 Start Interview
    @GetMapping("/start")
    public String startInterview(@RequestParam String role) {
        return aiService.startInterview(role);
    }

    // 🔁 Next Question
    @PostMapping("/next")
    public String nextQuestion(@RequestBody String answer) {
        return aiService.nextQuestion(answer);
    }

    // 📊 Final Result
    @PostMapping("/final")
    public String finalResult(@RequestBody String answers) {
        return aiService.finalEvaluation(answers);
    }

    // ✅ 🆕 ATS API
    @PostMapping("/ats")
    public String ats(@RequestBody Map<String, String> data) {

        String resume = data.get("resume");
        String job = data.get("job");

        return aiService.atsScore(resume, job);
    }
    
    // ✅ 🆕 JOB RECOMMENDATION API
    @GetMapping("/recommend")
    public String recommend(@RequestParam String skills) {

        return aiService.recommendJobs(skills);
    }
}