package com.appointment.booking.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * User Entity - UPDATED
 * 
 * NEW: Guest booking support with NIC
 * Users can book without registration using phone + NIC
 */
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    /**
     * Email is now optional (not required for guest bookings)
     */
    @Column(unique = true)
    private String email;
    
    /**
     * Phone number - REQUIRED for bookings
     */
    @Column(nullable = false)
    private String phoneNumber;
    
    /**
     * NIC (National Identity Card) - REQUIRED for bookings
     * Used for verification when checking bookings
     */
    @Column(nullable = false)
    private String nic;
    
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(Long id, String name, String email, String phoneNumber, 
                String nic, Integer age, Gender gender) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nic = nic;
        this.age = age;
        this.gender = gender;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}