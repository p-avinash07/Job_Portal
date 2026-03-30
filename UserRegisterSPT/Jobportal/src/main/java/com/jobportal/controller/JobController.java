package com.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.jobportal.entity.Job;
import com.jobportal.service.JobService;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*") // important for React later
public class JobController {

    @Autowired
    private JobService jobService;

    // Add job
    @PostMapping("/add")
    public Job addJob(@RequestBody Job job) {
        return jobService.addJob(job);
    }

    // Get all jobs
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Get job by id
    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    // Delete job
    @DeleteMapping("/delete/{id}")
    public String deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
    
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String keyword) {
        return jobService.searchJobs(keyword);
    }

    // --- NEW ENDPOINT: Toggle Job Status ---
    @PutMapping("/toggle/{id}")
    public Job toggleJobStatus(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job != null) {
            Boolean currentState = job.getIsActive();
            // Fallback to true if it was null from old data
            if (currentState == null) {
                currentState = true;
            }
            job.setIsActive(!currentState);
            
            // Re-saving the job will safely update the row in the database
            return jobService.addJob(job);
        }
        return null;
    }
}
