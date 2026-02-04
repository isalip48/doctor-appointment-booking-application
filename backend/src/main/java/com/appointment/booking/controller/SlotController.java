package com.appointment.booking.controller;

import com.appointment.booking.dto.SlotDTO;
import com.appointment.booking.dto.SlotSearchRequest;
import com.appointment.booking.service.SlotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Slot Controller
 * 
 * BASE URL: /api/slots
 * 
 * MOST IMPORTANT CONTROLLER FOR USERS
 * Main functionality: Search available appointment slots
 */
@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class SlotController {
    
    private final SlotService slotService;
    
    public SlotController(SlotService slotService) {
        this.slotService = slotService;
    }
    
    /**
     * GET /api/slots
     * Get all available slots (no filters)
     * 
     * WARNING: In production, this could return thousands of slots
     * Better to require at least a date filter
     */
    @GetMapping
    public ResponseEntity<List<SlotDTO>> getAllAvailableSlots() {
        List<SlotDTO> slots = slotService.getAllAvailableSlots();
        return ResponseEntity.ok(slots);
    }
    
    /**
     * POST /api/slots/search
     * Search slots with filters
     * 
     * WHY POST instead of GET:
     * - Complex search criteria (multiple optional filters)
     * - Cleaner to send as JSON body than query params
     * - Query params get messy: ?hospitalId=1&specialization=Cardiology&date=2024-02-05
     * 
     * REQUEST BODY:
     * {
     *   "hospitalId": 1,             // Optional
     *   "doctorId": null,            // Optional
     *   "specialization": "Cardiology", // Optional
     *   "date": "2024-02-05"         // Required
     * }
     * 
     * FRONTEND USAGE:
     * const searchSlots = async () => {
     *   const response = await fetch('http://localhost:8080/api/slots/search', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({
     *       hospitalId: selectedHospital,
     *       specialization: selectedSpecialization,
     *       date: selectedDate
     *     })
     *   });
     *   const slots = await response.json();
     * }
     */
    @PostMapping("/search")
    public ResponseEntity<List<SlotDTO>> searchSlots(@RequestBody SlotSearchRequest request) {
        List<SlotDTO> slots = slotService.searchSlots(request);
        return ResponseEntity.ok(slots);
    }
    
    /**
     * GET /api/slots/doctor/{doctorId}
     * Get all slots for a specific doctor
     * 
     * USE CASE: Viewing doctor's profile page
     */
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<SlotDTO>> getSlotsByDoctor(@PathVariable Long doctorId) {
        List<SlotDTO> slots = slotService.getSlotsByDoctor(doctorId);
        return ResponseEntity.ok(slots);
    }
    
    /**
     * GET /api/slots/doctor/{doctorId}/range
     * Get doctor's slots in a date range
     * 
     * QUERY PARAMS:
     * - startDate: Start of range (required)
     * - endDate: End of range (required)
     * 
     * EXAMPLE:
     * GET /api/slots/doctor/5/range?startDate=2024-02-05&endDate=2024-02-12
     * Returns all slots for doctor 5 between Feb 5-12
     */
    @GetMapping("/doctor/{doctorId}/range")
    public ResponseEntity<List<SlotDTO>> getSlotsByDoctorAndRange(
            @PathVariable Long doctorId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        List<SlotDTO> slots = slotService.getSlotsByDoctorAndDateRange(
            doctorId, startDate, endDate
        );
        return ResponseEntity.ok(slots);
    }
    
    /**
     * POST /api/slots
     * Create a single slot (Admin only)
     * 
     * REQUEST BODY:
     * {
     *   "doctorId": 1,
     *   "date": "2024-02-10",
     *   "startTime": "09:00",
     *   "endTime": "09:30",
     *   "totalSlots": 1
     * }
     */
    @PostMapping
    public ResponseEntity<?> createSlot(
            @RequestParam Long doctorId,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam Integer totalSlots) {
        
        try {
            SlotDTO slot = slotService.createSlot(doctorId, date, startTime, endTime, totalSlots);
            return ResponseEntity.status(HttpStatus.CREATED).body(slot);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
    
    /**
     * POST /api/slots/bulk
     * Create multiple slots at once (Admin helper)
     * 
     * USE CASE: "Create slots for Dr. Smith from Feb 5-12, every day 9AM-1PM, 30min each"
     * 
     * REQUEST BODY:
     * {
     *   "doctorId": 1,
     *   "startDate": "2024-02-05",
     *   "days": 7,
     *   "timeSlots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"],
     *   "slotDuration": 30,
     *   "slotsPerTime": 1
     * }
     * 
     * CREATES: 7 days × 8 time slots = 56 slots
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> createBulkSlots(
            @RequestParam Long doctorId,
            @RequestParam String startDate,
            @RequestParam Integer days,
            @RequestParam List<String> timeSlots,
            @RequestParam Integer slotDuration,
            @RequestParam Integer slotsPerTime) {
        
        try {
            List<SlotDTO> slots = slotService.createBulkSlots(
                doctorId, startDate, days, timeSlots, slotDuration, slotsPerTime
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(slots);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
}