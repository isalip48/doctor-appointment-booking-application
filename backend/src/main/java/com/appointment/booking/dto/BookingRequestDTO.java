package com.appointment.booking.dto;

/**
 * Booking Request DTO - UPDATED
 * 
 * NEW: Include user details for guest bookings
 */
public class BookingRequestDTO {
    private Long slotId;
    
    // User details (for guest booking or user creation)
    private String name;
    private String phoneNumber;
    private String nic;
    private String email;  // Optional
    private Integer age;   // Optional
    private String gender; // Optional: "MALE", "FEMALE", "OTHER"
    
    private String patientNotes;
    
    // Constructors
    public BookingRequestDTO() {}
    
    // Getters and Setters
    public Long getSlotId() { 
        return slotId; 
    }
    
    public void setSlotId(Long slotId) { 
        this.slotId = slotId; 
    }
    
    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }
    
    public String getPhoneNumber() { 
        return phoneNumber; 
    }
    
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber; 
    }
    
    public String getNic() { 
        return nic; 
    }
    
    public void setNic(String nic) { 
        this.nic = nic; 
    }
    
    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }
    
    public Integer getAge() { 
        return age; 
    }
    
    public void setAge(Integer age) { 
        this.age = age; 
    }
    
    public String getGender() { 
        return gender; 
    }
    
    public void setGender(String gender) { 
        this.gender = gender; 
    }
    
    public String getPatientNotes() { 
        return patientNotes; 
    }
    
    public void setPatientNotes(String patientNotes) { 
        this.patientNotes = patientNotes; 
    }
}