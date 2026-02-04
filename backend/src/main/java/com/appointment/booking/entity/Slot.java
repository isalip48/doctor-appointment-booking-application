package com.appointment.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Slot Entity
 * 
 * WHY: Represents an available time slot for appointments
 * KEY CONCEPT: Each slot has a date, time, and limited capacity
 */
@Entity
@Table(name = "slots", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "slot_date", "start_time"}))
public class Slot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * WHY LocalDate: Stores date without time (2024-02-04)
     * Better than String for date operations and queries
     */
    @Column(nullable = false)
    private LocalDate slotDate;
    
    /**
     * WHY LocalTime: Stores time without date (09:00:00)
     * Allows easy time comparisons and formatting
     */
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    /**
     * Total slots available for this time
     * WHY: Some doctors can see multiple patients at the same time
     */
    @Column(nullable = false)
    private Integer totalSlots = 1;
    
    /**
     * How many slots are already booked
     */
    @Column(nullable = false)
    private Integer bookedSlots = 0;
    
    /**
     * Computed field: slot is available if bookedSlots < totalSlots
     * WHY Boolean: Easy to query "give me all available slots"
     */
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    /**
     * WHY ManyToOne: Many slots belong to one doctor
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    
    // Constructors
    public Slot() {}
    
    public Slot(Long id, LocalDate slotDate, LocalTime startTime, LocalTime endTime, 
                Integer totalSlots, Integer bookedSlots, Doctor doctor) {
        this.id = id;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalSlots = totalSlots;
        this.bookedSlots = bookedSlots;
        this.doctor = doctor;
        this.isAvailable = bookedSlots < totalSlots;
    }
    
    /**
     * BUSINESS LOGIC: Book a slot
     * WHY: Keep business logic in entity to ensure consistency
     */
    public boolean bookSlot() {
        if (bookedSlots < totalSlots) {
            bookedSlots++;
            isAvailable = bookedSlots < totalSlots;
            return true;
        }
        return false;
    }
    
    /**
     * BUSINESS LOGIC: Cancel a booking
     */
    public void cancelSlot() {
        if (bookedSlots > 0) {
            bookedSlots--;
            isAvailable = true;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getSlotDate() { return slotDate; }
    public void setSlotDate(LocalDate slotDate) { this.slotDate = slotDate; }
    
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    
    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }
    
    public Integer getBookedSlots() { return bookedSlots; }
    public void setBookedSlots(Integer bookedSlots) { this.bookedSlots = bookedSlots; }
    
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
    
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
}