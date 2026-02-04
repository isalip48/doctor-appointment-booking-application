package com.appointment.booking.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Doctor Entity
 * 
 * WHY: Represents a doctor who works at a hospital
 * RELATIONSHIPS: 
 * - Many doctors belong to one hospital (ManyToOne)
 * - One doctor has many slots (OneToMany)
 */
@Entity
@Table(name = "doctors")
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String specialization;
    
    private String qualifications;
    
    private Integer experienceYears;
    
    private Double consultationFee;
    
    /**
     * WHY ManyToOne: Many doctors work at one hospital
     * EAGER: Always load hospital info when loading a doctor (we usually need it)
     * JoinColumn: Creates 'hospital_id' foreign key column in doctors table
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    
    /**
     * WHY OneToMany: One doctor has many time slots
     * LAZY: Don't load all slots when loading a doctor (could be hundreds)
     */
    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    private List<Slot> slots = new ArrayList<>();
    
    // Constructors
    public Doctor() {}
    
    public Doctor(Long id, String name, String specialization, String qualifications, 
                  Integer experienceYears, Double consultationFee, Hospital hospital) {
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
    
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    
    public List<Slot> getSlots() { return slots; }
    public void setSlots(List<Slot> slots) { this.slots = slots; }
}