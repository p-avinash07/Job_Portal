package com.jobportal.controller;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.entity.Application;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.service.ApplicationService;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173") // better than *
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;


    // Apply job (FIXED File Upload paths to prevent Tomcat Temp Folder errors)
    @PostMapping("/apply")
    public ResponseEntity<?> applyJob(
            @RequestParam("userId") Long userId,
            @RequestParam("jobId") Long jobId,
            @RequestParam("status") String status,
            @RequestParam("applicantName") String applicantName,
            @RequestParam("applicantEmail") String applicantEmail,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam("resume") MultipartFile resumeFile) {
        
        try {
            Application app = new Application();
            app.setUserId(userId);
            app.setJobId(jobId);
            app.setStatus(ApplicationStatus.valueOf(status)); 
            
            app.setApplicantName(applicantName);
            app.setApplicantEmail(applicantEmail);
            app.setMessage(message);
            app.setAppliedDate(LocalDate.now());

            // 1. Force an EXACT absolute path to your Spring Boot project root
            String uploadDir = System.getProperty("user.dir") + "/uploads/resumes/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // 2. Save the file locally using java.nio.file to bypass the Tomcat temp folder trap!
            String fileName = System.currentTimeMillis() + "_" + resumeFile.getOriginalFilename();
            Path path = Paths.get(uploadDir + fileName);
            java.nio.file.Files.copy(resumeFile.getInputStream(), path, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 3. Save the filename string to the database
            app.setResume(fileName);

            Application saved = applicationService.applyJob(app);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Apply failed: " + e.getMessage());
        }
    }

    // NEW ENDPOINT: Download/View the Resume PDF
    @GetMapping("/resume/{id}")
    public ResponseEntity<Resource> getResume(@PathVariable Long id) {
        try {
            // IMPORTANT: Ensure your ApplicationService has a method to get an application by ID
            // Something like: return applicationRepository.findById(id).orElse(null);
            Application app = applicationService.getApplicationById(id); // Modify this method name if yours is different!
            
            if (app == null || app.getResume() == null) {
                return ResponseEntity.notFound().build();
            }

            // Locate the physical file
            Path filePath = Paths.get("uploads/resumes/" + app.getResume());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get applications by user
    @GetMapping("/user/{userId}")
    public List<Application> getUserApps(@PathVariable Long userId) {
        return applicationService.getUserApplications(userId);
    }

    // Get applications by job
    @GetMapping("/job/{jobId}")
    public List<Application> getJobApps(@PathVariable Long jobId) {
        return applicationService.getJobApplications(jobId);
    }

    // ✅ FIXED STATUS UPDATE (VERY IMPORTANT)
    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestParam String status) {
        try {
            Application updated = applicationService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating status: " + e.getMessage());
        }
    }
}
