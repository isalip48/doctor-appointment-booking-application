package com.appointment.booking.dto;

/**
 * Booking Request DTO
 * 
 * WHY: Data needed from frontend to create a booking
 * USAGE: POST /api/bookings - receives this JSON
 * 
 * EXAMPLE JSON FROM FRONTEND:
 * {
 *   "slotId": 123,
 *   "userId": 45,
 *   "patientNotes": "First time visit, mild chest pain"
 * }
 */
public class BookingRequest {
    private Long slotId;    // Which time slot to book
    private Long userId;    // Who is booking
    private String patientNotes;  // Optional: patient's symptoms/notes
    
    // Constructors
    public BookingRequest() {}
    
    public BookingRequest(Long slotId, Long userId, String patientNotes) {
        this.slotId = slotId;
        this.userId = userId;
        this.patientNotes = patientNotes;
    }
    
    // Getters and Setters
    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getPatientNotes() { return patientNotes; }
    public void setPatientNotes(String patientNotes) { this.patientNotes = patientNotes; }
}