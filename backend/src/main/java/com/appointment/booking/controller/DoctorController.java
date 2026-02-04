package com.appointment.booking.controller;

import com.appointment.booking.dto.DoctorDTO;
import com.appointment.booking.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Doctor Controller
 * 
 * BASE URL: /api/doctors
 * 
 * FEATURES:
 * - List all doctors
 * - Filter by hospital
 * - Filter by specialization
 * - Get available specializations (for dropdown)
 */
@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {
    
    private final DoctorService doctorService;
    
    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }
    
    /**
     * GET /api/doctors
     * Get all doctors
     * 
     * Optional filters via query parameters:
     * - hospitalId: Filter by hospital
     * - specialization: Filter by specialization
     * 
     * EXAMPLES:
     * GET /api/doctors -> All doctors
     * GET /api/doctors?hospitalId=1 -> Doctors at hospital 1
     * GET /api/doctors?specialization=Cardiology -> All cardiologists
     * GET /api/doctors?hospitalId=1&specialization=Cardiology -> Cardiologists at hospital 1
     * 
     * WHY required = false:
     * - Parameters are optional
     * - Method decides which filter to apply based on what's provided
     */
    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getDoctors(
            @RequestParam(required = false) Long hospitalId,
            @RequestParam(required = false) String specialization) {
        
        List<DoctorDTO> doctors;
        
        // CONDITIONAL LOGIC: Apply appropriate filter
        if (hospitalId != null && specialization != null) {
            // Both filters provided
            doctors = doctorService.getDoctorsByHospitalAndSpecialization(hospitalId, specialization);
        } else if (hospitalId != null) {
            // Only hospital filter
            doctors = doctorService.getDoctorsByHospital(hospitalId);
        } else if (specialization != null) {
            // Only specialization filter
            doctors = doctorService.getDoctorsBySpecialization(specialization);
        } else {
            // No filters - return all
            doctors = doctorService.getAllDoctors();
        }
        
        return ResponseEntity.ok(doctors);
    }
    
    /**
     * GET /api/doctors/{id}
     * Get doctor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctor = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctor);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }
    
    /**
     * GET /api/doctors/specializations
     * Get list of all unique specializations
     * 
     * USE CASE: Populate dropdown in UI
     * 
     * RETURNS: ["Cardiology", "Dermatology", "Pediatrics", ...]
     */
    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        List<String> specializations = doctorService.getAllSpecializations();
        return ResponseEntity.ok(specializations);
    }
    
    /**
     * POST /api/doctors
     * Create new doctor (Admin only)
     * 
     * REQUEST BODY:
     * {
     *   "name": "Dr. John Smith",
     *   "specialization": "Cardiology",
     *   "qualifications": "MBBS, MD",
     *   "experienceYears": 15,
     *   "consultationFee": 5000.00,
     *   "hospital": { "id": 1 }
     * }
     */
    @PostMapping
    public ResponseEntity<?> createDoctor(@RequestBody DoctorDTO doctorDTO) {
        try {
            DoctorDTO created = doctorService.createDoctor(doctorDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
}