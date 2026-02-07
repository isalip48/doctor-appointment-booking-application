package com.appointment.booking.dto;

public class SlotDTO {
    private Long id;
    private String slotDate;
    private String consultationStartTime;
    private String nextAvailableTime;      // NEW: Calculated next available time
    private String estimatedEndTime;       // NEW: When consultation ends for the day
    private Integer maxBookingsPerDay;
    private Integer currentBookings;
    private Integer remainingSlots;        // NEW: How many slots left
    private Integer minutesPerPatient;
    private Boolean isAvailable;
    private DoctorSummaryDTO doctor;
    private HospitalDTO hospital;
    
    public SlotDTO() {}
    
    public SlotDTO(Long id, String slotDate, String consultationStartTime, 
                   String nextAvailableTime, String estimatedEndTime,
                   Integer maxBookingsPerDay, Integer currentBookings, 
                   Integer remainingSlots, Integer minutesPerPatient,
                   Boolean isAvailable, DoctorSummaryDTO doctor, HospitalDTO hospital) {
        this.id = id;
        this.slotDate = slotDate;
        this.consultationStartTime = consultationStartTime;
        this.nextAvailableTime = nextAvailableTime;
        this.estimatedEndTime = estimatedEndTime;
        this.maxBookingsPerDay = maxBookingsPerDay;
        this.currentBookings = currentBookings;
        this.remainingSlots = remainingSlots;
        this.minutesPerPatient = minutesPerPatient;
        this.isAvailable = isAvailable;
        this.doctor = doctor;
        this.hospital = hospital;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSlotDate() { return slotDate; }
    public void setSlotDate(String slotDate) { this.slotDate = slotDate; }
    
    public String getConsultationStartTime() { return consultationStartTime; }
    public void setConsultationStartTime(String consultationStartTime) { 
        this.consultationStartTime = consultationStartTime; 
    }
    
    public String getNextAvailableTime() { return nextAvailableTime; }
    public void setNextAvailableTime(String nextAvailableTime) { 
        this.nextAvailableTime = nextAvailableTime; 
    }
    
    public String getEstimatedEndTime() { return estimatedEndTime; }
    public void setEstimatedEndTime(String estimatedEndTime) { 
        this.estimatedEndTime = estimatedEndTime; 
    }
    
    public Integer getMaxBookingsPerDay() { return maxBookingsPerDay; }
    public void setMaxBookingsPerDay(Integer maxBookingsPerDay) { 
        this.maxBookingsPerDay = maxBookingsPerDay; 
    }
    
    public Integer getCurrentBookings() { return currentBookings; }
    public void setCurrentBookings(Integer currentBookings) { 
        this.currentBookings = currentBookings; 
    }
    
    public Integer getRemainingSlots() { return remainingSlots; }
    public void setRemainingSlots(Integer remainingSlots) { 
        this.remainingSlots = remainingSlots; 
    }
    
    public Integer getMinutesPerPatient() { return minutesPerPatient; }
    public void setMinutesPerPatient(Integer minutesPerPatient) { 
        this.minutesPerPatient = minutesPerPatient; 
    }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    public DoctorSummaryDTO getDoctor() { return doctor; }
    public void setDoctor(DoctorSummaryDTO doctor) { this.doctor = doctor; }
    
    public HospitalDTO getHospital() { return hospital; }
    public void setHospital(HospitalDTO hospital) { this.hospital = hospital; }
}