package com.appointment.booking.service;

import com.appointment.booking.dto.SlotDTO;
import com.appointment.booking.dto.SlotSearchRequest;
import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.repository.DoctorRepository;
import com.appointment.booking.repository.SlotRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Slot Service
 * 
 * MOST COMPLEX SERVICE
 * WHY: Handles advanced search with multiple optional filters
 * RESPONSIBILITIES:
 * - Search slots with various filters
 * - Create slots (admin)
 * - Check slot availability
 */
@Service
public class SlotService {
    
    private final SlotRepository slotRepository;
    private final DoctorRepository doctorRepository;
    private final MappingService mappingService;
    
    public SlotService(SlotRepository slotRepository,
                      DoctorRepository doctorRepository,
                      MappingService mappingService) {
        this.slotRepository = slotRepository;
        this.doctorRepository = doctorRepository;
        this.mappingService = mappingService;
    }
    
    /**
     * Get all available slots
     * 
     * SIMPLE: No filters, just show everything available
     * USE CASE: "What appointments are available anywhere?"
     */
    public List<SlotDTO> getAllAvailableSlots() {
        return slotRepository.findAll()
            .stream()
            .filter(slot -> slot.getIsAvailable())  // Only available slots
            .map(mappingService::toSlotDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Search slots with flexible filters
     * 
     * COMPLEX LOGIC: Apply filters based on what user provided
     * 
     * DECISION TREE:
     * 1. If doctorId provided -> search by doctor and date
     * 2. Else if hospitalId + specialization -> search by both
     * 3. Else if hospitalId only -> search by hospital and date
     * 4. Else -> return all available slots on that date
     * 
     * WHY THIS APPROACH: Most specific filter wins (best performance)
     */
    public List<SlotDTO> searchSlots(SlotSearchRequest request) {
        // Convert string date to LocalDate
        // WHY: Database stores LocalDate, we need to convert from "2024-02-05"
        LocalDate searchDate = LocalDate.parse(request.getDate());
        
        List<Slot> slots;
        
        // FILTER LOGIC: Most specific to least specific
        if (request.getDoctorId() != null) {
            // SPECIFIC: User selected a specific doctor
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            slots = slotRepository.findByDoctorAndSlotDateAndIsAvailableTrueOrderByStartTime(
                doctor, searchDate
            );
            
        } else if (request.getHospitalId() != null && request.getSpecialization() != null) {
            // MEDIUM: User wants "Cardiologists at Apollo Hospital on Feb 5"
            slots = slotRepository.findAvailableSlotsByHospitalSpecializationAndDate(
                request.getHospitalId(),
                request.getSpecialization(),
                searchDate
            );
            
        } else if (request.getHospitalId() != null) {
            // MEDIUM: User wants "Any doctor at Apollo Hospital on Feb 5"
            slots = slotRepository.findAvailableSlotsByHospitalAndDate(
                request.getHospitalId(),
                searchDate
            );
            
        } else {
            // BROAD: User just wants "All available slots on Feb 5"
            // NOTE: This could return a lot of data in production
            slots = slotRepository.findAll()
                .stream()
                .filter(s -> s.getSlotDate().equals(searchDate) && s.getIsAvailable())
                .collect(Collectors.toList());
        }
        
        // Convert all found slots to DTOs
        return slots.stream()
            .map(mappingService::toSlotDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get slots for a specific doctor
     * 
     * USE CASE: Viewing a doctor's profile, show all their upcoming slots
     */
    public List<SlotDTO> getSlotsByDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        return slotRepository.findByDoctorOrderBySlotDateAscStartTimeAsc(doctor)
            .stream()
            .map(mappingService::toSlotDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get slots in a date range
     * 
     * USE CASE: "Show me Dr. Smith's slots for the next 7 days"
     */
    public List<SlotDTO> getSlotsByDoctorAndDateRange(Long doctorId, String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        return slotRepository.findSlotsByDoctorAndDateRange(doctorId, start, end)
            .stream()
            .map(mappingService::toSlotDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Create a new slot (Admin function)
     * 
     * BUSINESS RULE: Can't create slot in the past
     * 
     * PARAMETERS EXPLAINED:
     * - doctorId: Which doctor
     * - date: Which day
     * - startTime: When it starts
     * - endTime: When it ends
     * - totalSlots: How many patients can book this time
     */
    public SlotDTO createSlot(Long doctorId, String date, String startTime, 
                             String endTime, Integer totalSlots) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        LocalDate slotDate = LocalDate.parse(date);
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);
        
        // VALIDATION: Can't create slots in the past
        if (slotDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot create slots for past dates");
        }
        
        // VALIDATION: End time must be after start time
        if (end.isBefore(start) || end.equals(start)) {
            throw new RuntimeException("End time must be after start time");
        }
        
        Slot slot = new Slot(
            null,
            slotDate,
            start,
            end,
            totalSlots,
            0,  // No bookings yet
            doctor
        );
        
        Slot savedSlot = slotRepository.save(slot);
        return mappingService.toSlotDTO(savedSlot);
    }
    
    /**
     * Bulk create slots (Admin helper)
     * 
     * USE CASE: Create morning slots (9 AM to 1 PM) for a doctor for next 7 days
     * 
     * WHY USEFUL: Admins don't want to create 28 slots manually
     * PARAMETERS:
     * - doctorId: Which doctor
     * - startDate: Start creating from this date
     * - days: How many days to create
     * - timeSlots: List of times like ["09:00", "10:00", "11:00", "12:00"]
     * - slotDuration: Minutes per slot (e.g., 30 for 30-minute appointments)
     */
    public List<SlotDTO> createBulkSlots(Long doctorId, String startDate, 
                                        Integer days, List<String> timeSlots,
                                        Integer slotDuration, Integer slotsPerTime) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        LocalDate currentDate = LocalDate.parse(startDate);
        List<Slot> createdSlots = new java.util.ArrayList<>();
        
        // LOOP: For each day
        for (int day = 0; day < days; day++) {
            LocalDate date = currentDate.plusDays(day);
            
            // LOOP: For each time slot in the day
            for (String timeSlot : timeSlots) {
                LocalTime start = LocalTime.parse(timeSlot);
                LocalTime end = start.plusMinutes(slotDuration);
                
                Slot slot = new Slot(
                    null,
                    date,
                    start,
                    end,
                    slotsPerTime,
                    0,
                    doctor
                );
                
                createdSlots.add(slot);
            }
        }
        
        // BATCH SAVE: Save all slots at once (better performance)
        List<Slot> savedSlots = slotRepository.saveAll(createdSlots);
        
        return savedSlots.stream()
            .map(mappingService::toSlotDTO)
            .collect(Collectors.toList());
    }
}