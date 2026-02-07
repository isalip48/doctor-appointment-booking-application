package com.appointment.booking.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appointment.booking.dto.SlotDTO;
import com.appointment.booking.service.SlotService;

/**
 * Slot Controller - UPDATED FOR NEW LOGIC
 * 
 * BASE URL: /api/slots
 * 
 * NEW FLOW:
 * - Users search by doctor name OR specialization + date
 * - Returns slots with next available time
 * - Each slot holds 30 bookings (10 mins each)
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
     * WARNING: Returns all available slots across all doctors
     * Consider pagination for production
     */
    @GetMapping
    public ResponseEntity<List<SlotDTO>> getAllAvailableSlots() {
        List<SlotDTO> slots = slotService.getAllAvailableSlots();
        return ResponseEntity.ok(slots);
    }
    
    /**
     * NEW ENDPOINT: GET /api/slots/search
     * Search slots by doctor name or specialization + date
     * 
     * QUERY PARAMETERS:
     * - query: Doctor name or specialization (required)
     * - date: Appointment date in yyyy-MM-dd format (required)
     * - type: "name" or "specialization" (default: "name")
     * 
     * EXAMPLES:
     * GET /api/slots/search?query=Fernando&date=2024-02-05&type=name
     * GET /api/slots/search?query=Cardiology&date=2024-02-05&type=specialization
     * 
     * FRONTEND USAGE:
     * const response = await apiClient.get('/slots/search', {
     *   params: { 
     *     query: 'Dr. Fernando', 
     *     date: '2024-02-05',
     *     type: 'name'
     *   }
     * });
     */
    @GetMapping("/search")
    public ResponseEntity<List<SlotDTO>> searchSlots(
            @RequestParam String query,
            @RequestParam String date,
            @RequestParam(defaultValue = "name") String type) {
        
        LocalDate searchDate = LocalDate.parse(date);
        List<SlotDTO> slots;
        
        if ("specialization".equalsIgnoreCase(type)) {
            slots = slotService.searchBySpecialization(query, searchDate);
        } else {
            slots = slotService.searchByDoctorName(query, searchDate);
        }
        
        return ResponseEntity.ok(slots);
    }
}