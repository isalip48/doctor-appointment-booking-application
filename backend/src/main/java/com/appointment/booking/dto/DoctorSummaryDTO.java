package com.appointment.booking.dto;

/**
 * Simplified Doctor DTO
 * 
 * WHY: Sometimes we don't need ALL doctor fields
 * USAGE: In slot listings, we just need basic doctor info
 * BENEFIT: Smaller JSON payload = faster API responses
 */
public class DoctorSummaryDTO {
    private Long id;
    private String name;
    private String specialization;
    
    // Constructors
    public DoctorSummaryDTO() {}
    
    public DoctorSummaryDTO(Long id, String name, String specialization) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}