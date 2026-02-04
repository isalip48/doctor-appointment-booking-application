package com.appointment.booking.controller;

import com.appointment.booking.dto.BookingDTO;
import com.appointment.booking.dto.BookingRequest;
import com.appointment.booking.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Booking Controller
 * 
 * BASE URL: /api/bookings
 * 
 * CRITICAL CONTROLLER: Handles appointment booking process
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    private final BookingService bookingService;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    /**
     * POST /api/bookings
     * Create a new booking
     * 
     * MOST IMPORTANT ENDPOINT FOR USERS
     * 
     * REQUEST BODY:
     * {
     *   "slotId": 123,
     *   "userId": 45,
     *   "patientNotes": "Feeling unwell since 3 days"
     * }
     * 
     * SUCCESS RESPONSE (201 CREATED):
     * {
     *   "id": 789,
     *   "bookingTime": "2024-02-04 15:30:00",
     *   "status": "CONFIRMED",
     *   "appointmentDate": "2024-02-10",
     *   "appointmentTime": "09:00",
     *   "doctor": { "id": 1, "name": "Dr. Smith", "specialization": "Cardiology" },
     *   "hospital": { "id": 5, "name": "Apollo Hospital" }
     * }
     * 
     * ERROR RESPONSES:
     * - 400 BAD REQUEST: Slot already full, invalid data
     * - 404 NOT FOUND: User or slot doesn't exist
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            BookingDTO booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            // DIFFERENT ERRORS, SAME STATUS CODE (for now)
            // In production: distinguish between 400 vs 404 vs 409 (conflict)
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
    
    /**
     * GET /api/bookings/user/{userId}
     * Get all bookings for a user
     * 
     * USE CASE: "My Appointments" page - shows all past and future appointments
     * 
     * RETURNS: List of all bookings, sorted by most recent first
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        List<BookingDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * GET /api/bookings/user/{userId}/upcoming
     * Get user's upcoming appointments
     * 
     * USE CASE: Dashboard widget "Your Next Appointment"
     * 
     * FILTERS:
     * - Only CONFIRMED bookings
     * - Only future dates (today or later)
     * - Sorted by soonest first
     */
    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<BookingDTO>> getUpcomingBookings(@PathVariable Long userId) {
        List<BookingDTO> bookings = bookingService.getUpcomingBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * GET /api/bookings/user/{userId}/past
     * Get user's past appointments
     * 
     * USE CASE: "Appointment History" section
     */
    @GetMapping("/user/{userId}/past")
    public ResponseEntity<List<BookingDTO>> getPastBookings(@PathVariable Long userId) {
        List<BookingDTO> bookings = bookingService.getPastBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * GET /api/bookings/{id}
     * Get single booking details
     * 
     * USE CASE: Viewing booking confirmation page
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }
    
    /**
     * DELETE /api/bookings/{id}/cancel
     * Cancel a booking
     * 
     * WHY DELETE: RESTful convention for cancellation
     * Alternative: PUT with status change, but DELETE is more semantic
     * 
     * QUERY PARAM: userId for security check (ensure user owns the booking)
     * 
     * EXAMPLE:
     * DELETE /api/bookings/789/cancel?userId=45
     * 
     * WHAT HAPPENS:
     * 1. Verify user owns this booking
     * 2. Check booking is CONFIRMED (can't cancel already cancelled)
     * 3. Free up the slot (decrement bookedSlots)
     * 4. Update booking status to CANCELLED
     * 
     * SUCCESS: Returns updated booking with status = "CANCELLED"
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        try {
            BookingDTO booking = bookingService.cancelBooking(id, userId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
}