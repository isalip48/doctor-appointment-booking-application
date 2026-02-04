package com.appointment.booking.dto;

/**
 * Hospital Data Transfer Object
 * 
 * WHY: Clean representation of hospital for API responses
 * WHAT IT CONTAINS: Only essential hospital info (no doctor list to avoid huge responses)
 */
public class HospitalDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String phoneNumber;
    
    // Constructors
    public HospitalDTO() {}
    
    public HospitalDTO(Long id, String name, String address, String city, String phoneNumber) {
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
}