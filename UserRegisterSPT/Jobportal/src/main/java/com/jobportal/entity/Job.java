package com.jobportal.entity;

import jakarta.persistence.*;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;

    @Column(length = 2000)
    private String description;

    private String salary;

    // --- NEW FIELDS ADDED ---
    private Long userId;
    private Boolean isActive = true;

    // Constructors
    public Job() {}

    // Getters & Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }

    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getSalary() { return salary; }

    public void setSalary(String salary) { this.salary = salary; }

    // --- NEW GETTERS & SETTERS ---
    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getIsActive() { return isActive; }

    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
