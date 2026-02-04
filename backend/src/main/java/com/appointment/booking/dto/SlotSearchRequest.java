package com.appointment.booking.dto;

/**
 * Slot Search Request DTO
 * 
 * WHY: Complex search with multiple optional filters
 * USAGE: GET /api/slots/search?hospitalId=1&specialization=Cardiology&date=2024-02-05
 * 
 * BENEFIT: All filters in one clean object instead of many method parameters
 */
public class SlotSearchRequest {
    private Long hospitalId;           // Filter by hospital (optional)
    private Long doctorId;             // Filter by specific doctor (optional)
    private String specialization;     // Filter by specialization (optional)
    private String date;               // Filter by date (required)
    
    /**
     * WHY ALL OPTIONAL (except date): Users can search broadly or narrowly
     * EXAMPLES:
     * 1. "Show all slots on Feb 5" - only date provided
     * 2. "Show Cardiology slots on Feb 5" - date + specialization
     * 3. "Show Dr. Smith's slots on Feb 5" - date + doctorId
     */
    
    // Constructors
    public SlotSearchRequest() {}
    
    public SlotSearchRequest(Long hospitalId, Long doctorId, String specialization, String date) {
        this.hospitalId = hospitalId;
        this.doctorId = doctorId;
        this.specialization = specialization;
        this.date = date;
    }
    
    // Getters and Setters
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}