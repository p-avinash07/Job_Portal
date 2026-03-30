package com.jobportal.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.entity.Application;
import com.jobportal.entity.ApplicationStatus;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Added JobRepository to automatically find the correct Company Name
    @Autowired
    private com.jobportal.repository.JobRepository jobRepository;

    // ✅ Apply Job
    public Application applyJob(Application app) {
        app.setStatus(ApplicationStatus.APPLIED);
        app.setAppliedDate(LocalDate.now());

        return applicationRepository.save(app);
    }

    // ✅ Get applications by user
    public List<Application> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    // ✅ Get applications by job
    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    // ✅ Update Status + Send Full Length Email (FINAL FIXED)
    public Application updateStatus(Long id, String status) {

        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // ✅ Fix status case issue
        ApplicationStatus newStatus = ApplicationStatus.valueOf(status.toUpperCase());

        app.setStatus(newStatus);
        applicationRepository.save(app);

        // ✅ Fetch user safely
        User user = userRepository.findById(app.getUserId()).orElse(null);
        
        // Setup dynamic variables for the email
        String companyName = "the hiring company";
        String jobTitle = "the applied role";
        
        try {
            com.jobportal.entity.Job job = jobRepository.findById(app.getJobId()).orElse(null);
            if (job != null) {
                if (job.getCompany() != null) companyName = job.getCompany();
                if (job.getTitle() != null) jobTitle = job.getTitle();
            }
        } catch (Exception e) {}

        if (user != null) {

            String subject = "Update on Your Job Application: " + jobTitle + " at " + companyName;
            StringBuilder msg = new StringBuilder();
            
            // Dynamic Corporate Introduction
            msg.append("Dear ").append(user.getName() != null ? user.getName() : "Candidate").append(",\r\n\r\n");
            msg.append("We are writing to you on behalf of ").append(companyName).append(" regarding your recent application for the ").append(jobTitle).append(" position.\r\n\r\n");

            // Formal logic based on status
            switch (newStatus) {
                case SHORTLISTED:
                case INTERVIEW:
                    msg.append("We are delighted to inform you that your application has been successfully shortlisted! The hiring team at ").append(companyName).append(" was highly impressed by your background and experience.\r\n\r\n");
                    
                    msg.append("As you move into the next phase, please note that further information regarding the upcoming interview process and scheduling will be communicated to you directly by the Talent Acquisition team at ")
                       .append(companyName).append(".\r\n\r\n");
                       
                    msg.append("Congratulations on reaching the next stage!\r\n\r\n");
                    break;

                case REJECTED:
                    msg.append("We wanted to thank you for taking the time to share your background and experience. ");
                    msg.append("While your qualifications are certainly impressive, the hiring team has decided to move forward with other candidates whose profiles more closely align with their immediate needs at this time.\r\n\r\n");
                    
                    msg.append(companyName).append(" appreciates your interest in joining their team and wishes you the absolute best in your future career endeavors.\r\n\r\n");
                    break;

                default:
                    msg.append("Your application status has formally been updated to: ").append(newStatus).append(".\r\n\r\n");
            }
            
            // Professional Sign-off
            msg.append("Best regards,\r\n");
            msg.append("The Job Portal Team\r\n");
            msg.append("(On behalf of ").append(companyName).append(")");


            // ✅ Send email safely
            try {
                emailService.sendEmail(user.getEmail(), subject, msg.toString());
                System.out.println("Mail sent to: " + user.getEmail());
            } catch (Exception e) {
                System.out.println("Email failed: " + e.getMessage());
            }
        }

        return app;
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id).orElse(null);
    }

}
