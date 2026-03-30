package com.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long jobId;
    
    // Newly added fields for the application payload
    private String applicantName;
    private String applicantEmail;
    private String message;

    private String resume;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;   // ✅ ENUM

    private LocalDate appliedDate;

    public Application() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public Long getJobId() { return jobId; }

    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getResume() { return resume; }

    public void setResume(String resume) { this.resume = resume; }

    public ApplicationStatus getStatus() { return status; }

    public void setStatus(ApplicationStatus status) { this.status = status; }

    public LocalDate getAppliedDate() { return appliedDate; }

    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }

    // Getters and setters for new fields
    public String getApplicantName() { return applicantName; }

    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }

    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getMessage() { return message; }

    public void setMessage(String message) { this.message = message; }
}
