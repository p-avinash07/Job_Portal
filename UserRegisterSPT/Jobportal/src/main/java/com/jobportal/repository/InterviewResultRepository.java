package com.jobportal.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jobportal.entity.InterviewResult;

public interface InterviewResultRepository extends JpaRepository<InterviewResult, Long> {

    List<InterviewResult> findByUserId(Long userId);
}