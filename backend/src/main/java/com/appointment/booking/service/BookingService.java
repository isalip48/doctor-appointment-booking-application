package com.appointment.booking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appointment.booking.dto.BookingDTO;
import com.appointment.booking.dto.BookingRequest;
import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.Booking.BookingStatus;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.entity.User;
import com.appointment.booking.repository.BookingRepository;
import com.appointment.booking.repository.SlotRepository;
import com.appointment.booking.repository.UserRepository;

/**
 * Booking Service
 * 
 * CRITICAL SERVICE: Handles appointment bookings
 * 
 * WHY @Transactional:
 * - Booking involves multiple database operations
 * - If any step fails, all changes rollback
 * - Prevents data inconsistencies
 * 
 * EXAMPLE WITHOUT TRANSACTION:
 * 1. Mark slot as booked ✓
 * 2. Create booking record ✗ (fails)
 * Result: Slot shows booked but no booking exists! (BAD)
 * 
 * WITH TRANSACTION:
 * If step 2 fails, step 1 is automatically undone
 */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final UserRepository userRepository;
    private final MappingService mappingService;

    public BookingService(BookingRepository bookingRepository,
            SlotRepository slotRepository,
            UserRepository userRepository,
            MappingService mappingService) {
        this.bookingRepository = bookingRepository;
        this.slotRepository = slotRepository;
        this.userRepository = userRepository;
        this.mappingService = mappingService;
    }

    /**
     * Create a new booking
     * 
     * CRITICAL BUSINESS LOGIC
     * 
     * @Transactional: All-or-nothing database operation
     * 
     *                 FLOW:
     *                 1. Validate user exists
     *                 2. Validate slot exists
     *                 3. Check slot availability (race condition handling)
     *                 4. Book the slot (increment counter)
     *                 5. Create booking record
     *                 6. Return confirmation
     */
    @Transactional
    public BookingDTO createBooking(BookingRequest request) {
        // Validate user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        // Validate slot
        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found with id: " + request.getSlotId()));

        // Get next available time BEFORE booking
        LocalTime appointmentTime = slot.getNextAvailableTime();

        // Book the slot
        synchronized (slot) {
            if (!slot.getIsAvailable()) {
                throw new RuntimeException("Slot is not available");
            }

            boolean booked = slot.bookSlot();
            if (!booked) {
                throw new RuntimeException("Failed to book slot - already full");
            }

            slotRepository.save(slot);
        }

        // Create booking with stored appointment time
        Booking booking = new Booking(
                user,
                slot,
                LocalDateTime.now(),
                appointmentTime, // NEW: Store the time they got
                Booking.BookingStatus.CONFIRMED);
        booking.setPatientNotes(request.getPatientNotes());
        booking.setAmountPaid(slot.getDoctor().getConsultationFee());

        Booking savedBooking = bookingRepository.save(booking);
        return mappingService.toBookingDTO(savedBooking);
    }

    /**
     * Get all bookings for a user
     * 
     * USE CASE: "My Appointments" page
     */
    public List<BookingDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserOrderByBookingTimeDesc(user)
                .stream()
                .map(mappingService::toBookingDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming appointments
     * 
     * USE CASE: Dashboard showing "Your next appointment"
     * FILTER: Only CONFIRMED bookings with future dates
     */
    public List<BookingDTO> getUpcomingBookings(Long userId) {
        return bookingRepository.findUpcomingBookingsByUser(userId, LocalDate.now())
                .stream()
                .map(mappingService::toBookingDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get past appointments
     * 
     * USE CASE: "Appointment History" section
     */
    public List<BookingDTO> getPastBookings(Long userId) {
        return bookingRepository.findPastBookingsByUser(userId, LocalDate.now())
                .stream()
                .map(mappingService::toBookingDTO)
                .collect(Collectors.toList());
    }

    /**
     * Cancel a booking
     * 
     * IMPORTANT: Must free up the slot for others
     * 
     * @Transactional: Both operations must succeed or both fail
     */
    @Transactional
    public BookingDTO cancelBooking(Long bookingId, Long userId) {
        // STEP 1: Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // STEP 2: Verify ownership (security check)
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }

        // STEP 3: Verify status
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }

        // STEP 4: Free up the slot
        Slot slot = booking.getSlot();
        slot.cancelSlot(); // Decrements bookedSlots, sets isAvailable=true
        slotRepository.save(slot);

        // STEP 5: Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        return mappingService.toBookingDTO(updatedBooking);
    }

    /**
     * Get booking by ID
     * 
     * USE CASE: View booking details page
     */
    public BookingDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return mappingService.toBookingDTO(booking);
    }
}