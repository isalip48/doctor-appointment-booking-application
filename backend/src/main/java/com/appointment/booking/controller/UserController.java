package com.appointment.booking.controller;

import com.appointment.booking.entity.User;
import com.appointment.booking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User Controller
 * 
 * BASE URL: /api/users
 * 
 * SIMPLE CRUD: For now, basic user management
 * TODO: Add authentication (login, signup, JWT tokens)
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * GET /api/users
     * Get all users (Admin only - to be secured later)
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    /**
     * GET /api/users/{id}
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/users
     * Register new user (Simplified - no password yet)
     * 
     * REQUEST BODY:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "phoneNumber": "0771234567",
     *   "age": 30,
     *   "gender": "MALE"
     * }
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("Email already registered");
        }
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
    
    /**
     * GET /api/users/email/{email}
     * Find user by email
     * 
     * USE CASE: Login flow (to be enhanced with password check)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}