package com.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.jobportal.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Already available but okay to keep
    Optional<User> findById(Long id);

    // ✅ 🔥 IMPORTANT (REQUIRED FOR LOGIN)
    User findByEmail(String email);
}