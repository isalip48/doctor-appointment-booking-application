package com.appointment.booking.dto;

/**
 * Doctor Data Transfer Object
 * 
 * WHY: Includes doctor info + their hospital (nested DTO)
 * USAGE: When showing "Dr. Smith works at Apollo Hospital"
 */
public class DoctorDTO {
    private Long id;
    private String name;
    private String specialization;
    private String qualifications;
    private Integer experienceYears;
    private Double consultationFee;
    
    /**
     * WHY NESTED DTO: Include hospital info without full Hospital entity
     * BENEFIT: Frontend gets doctor + hospital in one API call
     * EXAMPLE JSON:
     * {
     *   "id": 1,
     *   "name": "Dr. Smith",
     *   "hospital": {
     *     "id": 5,
     *     "name": "Apollo Hospital",
     *     "city": "Colombo"
     *   }
     * }
     */
    private HospitalDTO hospital;
    
    // Constructors
    public DoctorDTO() {}
    
    public DoctorDTO(Long id, String name, String specialization, String qualifications,
                     Integer experienceYears, Double consultationFee, HospitalDTO hospital) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.qualifications = qualifications;
        this.experienceYears = experienceYears;
        this.consultationFee = consultationFee;
        this.hospital = hospital;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public String getQualifications() { return qualifications; }
    public void setQualifications(String qualifications) { this.qualifications = qualifications; }
    
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    
    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }
    
    public HospitalDTO getHospital() { return hospital; }
    public void setHospital(HospitalDTO hospital) { this.hospital = hospital; }
}