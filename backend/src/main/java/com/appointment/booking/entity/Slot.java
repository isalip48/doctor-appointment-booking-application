package com.appointment.booking.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * Updated Slot Entity - NEW LOGIC
 * 
 * KEY CHANGES:
 * - ONE slot per doctor per day (not multiple time slots)
 * - 30 bookings capacity per day
 * - 10 minutes per patient
 * - Auto-calculates next available time
 */
@Entity
@Table(name = "slots", uniqueConstraints = @UniqueConstraint(columnNames = { "doctor_id", "slot_date" }))
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate slotDate;

    /**
     * When doctor starts consultations for the day
     * Example: 09:00
     */
    @Column(nullable = false)
    private LocalTime consultationStartTime;

    /**
     * Maximum bookings per day
     * Fixed at 30
     */
    @Column(nullable = false)
    private Integer maxBookingsPerDay = 30;

    /**
     * Current number of bookings
     */
    @Column(nullable = false)
    private Integer currentBookings = 0;

    /**
     * Time per patient in minutes
     * Fixed at 10
     */
    @Column(nullable = false)
    private Integer minutesPerPatient = 10;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Constructors
    public Slot() {
    }

    public Slot(Long id, LocalDate slotDate, LocalTime consultationStartTime, Doctor doctor) {
        this.id = id;
        this.slotDate = slotDate;
        this.consultationStartTime = consultationStartTime;
        this.doctor = doctor;
        this.maxBookingsPerDay = 30;
        this.currentBookings = 0;
        this.minutesPerPatient = 10;
        this.isAvailable = true;
    }

    /**
     * Calculate next available appointment time
     * Formula: startTime + (currentBookings * minutesPerPatient)
     */
    public LocalTime getNextAvailableTime() {
        return consultationStartTime.plusMinutes((long) currentBookings * minutesPerPatient);
    }

    /**
     * Calculate estimated end time for the day
     */
    public LocalTime getEstimatedEndTime() {
        return consultationStartTime.plusMinutes((long) maxBookingsPerDay * minutesPerPatient);
    }

    /**
     * Calculate remaining slots
     */
    public Integer getRemainingSlots() {
        return maxBookingsPerDay - currentBookings;
    }

    /**
     * Book a slot - increments counter
     */
    public boolean bookSlot() {
        if (currentBookings < maxBookingsPerDay) {
            currentBookings++;
            isAvailable = currentBookings < maxBookingsPerDay;
            return true;
        }
        return false;
    }

    /**
     * Cancel a booking - decrements counter
     */
    public void cancelSlot() {
        if (currentBookings > 0) {
            currentBookings--;
            isAvailable = true;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public LocalTime getConsultationStartTime() {
        return consultationStartTime;
    }

    public void setConsultationStartTime(LocalTime consultationStartTime) {
        this.consultationStartTime = consultationStartTime;
    }

    public Integer getMaxBookingsPerDay() {
        return maxBookingsPerDay;
    }

    public void setMaxBookingsPerDay(Integer maxBookingsPerDay) {
        this.maxBookingsPerDay = maxBookingsPerDay;
    }

    public Integer getCurrentBookings() {
        return currentBookings;
    }

    public void setCurrentBookings(Integer currentBookings) {
        this.currentBookings = currentBookings;
    }

    public Integer getMinutesPerPatient() {
        return minutesPerPatient;
    }

    public void setMinutesPerPatient(Integer minutesPerPatient) {
        this.minutesPerPatient = minutesPerPatient;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}