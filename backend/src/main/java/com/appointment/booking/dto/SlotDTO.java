package com.appointment.booking.dto;

/**
 * Slot Data Transfer Object
 * 
 * WHY: Combines slot timing + doctor info + hospital info
 * USAGE: Main DTO for slot search results
 */
public class SlotDTO {
    private Long id;
    
    /**
     * WHY String: Easier for frontend to display (no date parsing needed)
     * FORMAT: "2024-02-05"
     * Backend stores as LocalDate, converts to String here
     */
    private String slotDate;
    
    /**
     * WHY String: Frontend displays "09:00 AM" directly
     * FORMAT: "09:00" or "09:00 AM" (we'll format in service layer)
     */
    private String startTime;
    private String endTime;
    
    /**
     * CAPACITY INFO: Frontend shows "2 of 5 slots available"
     */
    private Integer totalSlots;
    private Integer bookedSlots;
    private Integer availableSlots; // Calculated: totalSlots - bookedSlots
    
    private Boolean isAvailable;
    
    /**
     * NESTED DTOs: Complete information in one response
     * Frontend gets: slot time + doctor details + hospital location
     */
    private DoctorSummaryDTO doctor;
    private HospitalDTO hospital;
    
    // Constructors
    public SlotDTO() {}
    
    public SlotDTO(Long id, String slotDate, String startTime, String endTime,
                   Integer totalSlots, Integer bookedSlots, Integer availableSlots,
                   Boolean isAvailable, DoctorSummaryDTO doctor, HospitalDTO hospital) {
        this.id = id;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalSlots = totalSlots;
        this.bookedSlots = bookedSlots;
        this.availableSlots = availableSlots;
        this.isAvailable = isAvailable;
        this.doctor = doctor;
        this.hospital = hospital;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSlotDate() { return slotDate; }
    public void setSlotDate(String slotDate) { this.slotDate = slotDate; }
    
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    
    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }
    
    public Integer getBookedSlots() { return bookedSlots; }
    public void setBookedSlots(Integer bookedSlots) { this.bookedSlots = bookedSlots; }
    
    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    public DoctorSummaryDTO getDoctor() { return doctor; }
    public void setDoctor(DoctorSummaryDTO doctor) { this.doctor = doctor; }
    
    public HospitalDTO getHospital() { return hospital; }
    public void setHospital(HospitalDTO hospital) { this.hospital = hospital; }
}