package com.appointment.booking.repository;

import com.appointment.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository
 * 
 * SIMPLE: Basic user lookup operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     * 
     * WHY: For login/authentication (future feature)
     * Optional: Might not find a user, so return Optional instead of null
     * 
     * HOW TO USE:
     * Optional<User> userOpt = userRepository.findByEmail("john@example.com");
     * if (userOpt.isPresent()) {
     *     User user = userOpt.get();
     * }
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if email already exists
     * 
     * WHY: Prevent duplicate registrations
     * Returns: true/false (fast, doesn't load entire user object)
     */
    boolean existsByEmail(String email);
}