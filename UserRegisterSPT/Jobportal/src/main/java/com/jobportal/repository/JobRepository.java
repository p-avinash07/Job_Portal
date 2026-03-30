package com.jobportal.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobportal.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCase(String title);
}