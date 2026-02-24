package com.appointment.booking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appointment.booking.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    /**
     * NEW: Find user by phone number and NIC
     * 
     * USE CASE: Guest booking lookup
     * User enters phone + NIC to view their bookings
     */
    Optional<User> findByPhoneNumberAndNic(String phoneNumber, String nic);
    
    /**
     * NEW: Check if user exists with this phone + NIC
     */
    boolean existsByPhoneNumberAndNic(String phoneNumber, String nic);
}