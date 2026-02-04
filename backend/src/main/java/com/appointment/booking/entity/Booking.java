package com.appointment.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Booking Entity
 * 
 * WHAT: Represents a confirmed appointment booking
 * WHY: Links a user to a specific slot, creating an appointment
 * 
 * BUSINESS RULES:
 * - One user can book multiple slots (different dates/doctors)
 * - One slot can have multiple bookings (up to totalSlots limit)
 * - Bookings can be CONFIRMED, CANCELLED, or COMPLETED
 */
@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * WHY ManyToOne: Many bookings belong to one user
     * EAGER: We always want to know who booked (small data, needed often)
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * WHY ManyToOne: Many bookings can be for the same slot
     * EXAMPLE: Slot has totalSlots=3, so 3 bookings can reference it
     * EAGER: We need slot details (time, doctor) when showing bookings
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;
    
    /**
     * WHY LocalDateTime: Stores when the booking was made (audit trail)
     * EXAMPLE: "Booked on 2024-02-04 at 10:30 AM"
     */
    @Column(nullable = false)
    private LocalDateTime bookingTime;
    
    /**
     * WHY Enum: Limited, predefined states prevent invalid data
     * STRING storage: Stores "CONFIRMED" in DB (readable in SQL queries)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;
    
    public enum BookingStatus {
        CONFIRMED,   // Booking is active
        CANCELLED,   // User cancelled
        COMPLETED,   // Appointment finished
        NO_SHOW      // User didn't show up
    }
    
    /**
     * WHY: Store patient-specific notes or symptoms
     * NULLABLE: Not all bookings need notes
     */
    private String patientNotes;
    
    /**
     * WHY: For future payment integration
     */
    private Double amountPaid;
    
    // Constructors
    public Booking() {}
    
    public Booking(User user, Slot slot, LocalDateTime bookingTime, BookingStatus status) {
        this.user = user;
        this.slot = slot;
        this.bookingTime = bookingTime;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Slot getSlot() { return slot; }
    public void setSlot(Slot slot) { this.slot = slot; }
    
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public String getPatientNotes() { return patientNotes; }
    public void setPatientNotes(String patientNotes) { this.patientNotes = patientNotes; }
    
    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }
}