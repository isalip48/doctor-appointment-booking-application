package com.appointment.booking.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Hospital Entity
 * 
 * WHY: Represents a hospital in the system
 * RELATIONSHIPS: One hospital can have many doctors
 */
@Entity
@Table(name = "hospitals")
public class Hospital {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String city;
    
    private String phoneNumber;
    
    /**
     * WHY OneToMany: One hospital has many doctors
     * mappedBy: Tells JPA that the 'hospital' field in Doctor entity owns this relationship
     * cascade: When we delete a hospital, we don't delete doctors (they might move to another hospital)
     * fetch = LAZY: Don't load all doctors when loading a hospital (performance optimization)
     */
    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY)
    private List<Doctor> doctors = new ArrayList<>();
    
    // Constructors
    public Hospital() {}
    
    public Hospital(Long id, String name, String address, String city, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.phoneNumber = phoneNumber;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public List<Doctor> getDoctors() { return doctors; }
    public void setDoctors(List<Doctor> doctors) { this.doctors = doctors; }
}