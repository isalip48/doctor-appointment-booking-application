package com.appointment.booking.repository;

import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.User;
import com.appointment.booking.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Booking Repository
 * 
 * FOCUSED: User's booking history and status tracking
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find all bookings for a user
     * 
     * WHY: "My Appointments" page
     * ORDER BY: Most recent bookings first
     */
    List<Booking> findByUserOrderByBookingTimeDesc(User user);
    
    /**
     * Find bookings by user and status
     * 
     * WHY: Filter "Show only my confirmed appointments" or "Cancelled history"
     */
    List<Booking> findByUserAndStatus(User user, BookingStatus status);
    
    /**
     * CUSTOM @Query: Find user's upcoming appointments
     * 
     * WHY: "What appointments do I have coming up?"
     * LOGIC:
     * - User's bookings only
     * - Status is CONFIRMED (not cancelled)
     * - Slot date is today or future (>= :today)
     * 
     * JOIN EXPLAINED:
     * Booking -> Slot (to get slotDate)
     * Sort by soonest date first
     */
    @Query("SELECT b FROM Booking b JOIN b.slot s " +
           "WHERE b.user.id = :userId " +
           "AND b.status = 'CONFIRMED' " +
           "AND s.slotDate >= :today " +
           "ORDER BY s.slotDate, s.startTime")
    List<Booking> findUpcomingBookingsByUser(
        @Param("userId") Long userId,
        @Param("today") LocalDate today
    );
    
    /**
     * CUSTOM @Query: Find past appointments
     * 
     * WHY: "Show my appointment history"
     * DIFFERENCE: slotDate < :today (in the past)
     */
    @Query("SELECT b FROM Booking b JOIN b.slot s " +
           "WHERE b.user.id = :userId " +
           "AND s.slotDate < :today " +
           "ORDER BY s.slotDate DESC, s.startTime DESC")
    List<Booking> findPastBookingsByUser(
        @Param("userId") Long userId,
        @Param("today") LocalDate today
    );
    
    /**
     * Count bookings for a specific slot
     * 
     * WHY: Verify slot capacity before booking
     * Double-check that bookedSlots counter is accurate
     */
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.slot.id = :slotId AND b.status = 'CONFIRMED'")
    Long countConfirmedBookingsBySlot(@Param("slotId") Long slotId);
}