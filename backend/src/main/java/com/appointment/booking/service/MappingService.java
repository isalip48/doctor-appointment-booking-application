package com.appointment.booking.service;

import com.appointment.booking.dto.*;
import com.appointment.booking.entity.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

/**
 * Mapping Service
 * 
 * WHY: Central place for Entity -> DTO conversions
 * BENEFIT: Reusable mapping logic, keeps other services clean
 * PATTERN: Every entity has a toDTO method
 */
@Service
public class MappingService {
    
    /**
     * DATE/TIME FORMATTERS
     * WHY: Consistent date/time formats across all APIs
     */
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    /**
     * Convert Hospital Entity to DTO
     * 
     * SIMPLE MAPPING: Copy all fields
     */
    public HospitalDTO toHospitalDTO(Hospital hospital) {
        if (hospital == null) return null;
        
        return new HospitalDTO(
            hospital.getId(),
            hospital.getName(),
            hospital.getAddress(),
            hospital.getCity(),
            hospital.getPhoneNumber()
        );
    }
    
    /**
     * Convert Doctor Entity to Summary DTO
     * 
     * WHY SUMMARY: Only basic info, no hospital details
     * USAGE: In slot listings where hospital is shown separately
     */
    public DoctorSummaryDTO toDoctorSummaryDTO(Doctor doctor) {
        if (doctor == null) return null;
        
        return new DoctorSummaryDTO(
            doctor.getId(),
            doctor.getName(),
            doctor.getSpecialization()
        );
    }
    
    /**
     * Convert Doctor Entity to Full DTO
     * 
     * WHY NESTED MAPPING: Converts doctor's hospital to HospitalDTO
     * EXAMPLE: Used when viewing doctor details page
     */
    public DoctorDTO toDoctorDTO(Doctor doctor) {
        if (doctor == null) return null;
        
        return new DoctorDTO(
            doctor.getId(),
            doctor.getName(),
            doctor.getSpecialization(),
            doctor.getQualifications(),
            doctor.getExperienceYears(),
            doctor.getConsultationFee(),
            toHospitalDTO(doctor.getHospital())  // Nested mapping!
        );
    }
    
    /**
     * Convert Slot Entity to DTO
     * 
     * COMPLEX MAPPING: 
     * - Converts LocalDate/LocalTime to String
     * - Calculates availableSlots
     * - Includes nested doctor + hospital
     */
    public SlotDTO toSlotDTO(Slot slot) {
        if (slot == null) return null;
        
        // Calculate available slots
        int available = slot.getTotalSlots() - slot.getBookedSlots();
        
        return new SlotDTO(
            slot.getId(),
            slot.getSlotDate().format(DATE_FORMATTER),      // LocalDate -> "2024-02-05"
            slot.getStartTime().format(TIME_FORMATTER),      // LocalTime -> "09:00"
            slot.getEndTime().format(TIME_FORMATTER),        // LocalTime -> "10:00"
            slot.getTotalSlots(),
            slot.getBookedSlots(),
            available,
            slot.getIsAvailable(),
            toDoctorSummaryDTO(slot.getDoctor()),           // Nested doctor
            toHospitalDTO(slot.getDoctor().getHospital())   // Nested hospital (from doctor)
        );
    }
    
    /**
     * Convert Booking Entity to DTO
     * 
     * MOST COMPLEX: Extracts data from multiple related entities
     * Booking -> Slot -> Doctor -> Hospital (3 levels deep!)
     */
    public BookingDTO toBookingDTO(Booking booking) {
        if (booking == null) return null;
        
        Slot slot = booking.getSlot();
        Doctor doctor = slot.getDoctor();
        Hospital hospital = doctor.getHospital();
        
        return new BookingDTO(
            booking.getId(),
            booking.getBookingTime().format(DATETIME_FORMATTER),  // When booked
            booking.getStatus().toString(),
            booking.getPatientNotes(),
            booking.getAmountPaid(),
            slot.getSlotDate().format(DATE_FORMATTER),            // Appointment date
            slot.getStartTime().format(TIME_FORMATTER),           // Appointment time
            toDoctorSummaryDTO(doctor),
            toHospitalDTO(hospital)
        );
    }
}