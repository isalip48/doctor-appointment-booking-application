package com.appointment.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appointment.booking.dto.BookingDTO;
import com.appointment.booking.dto.BookingRequestDTO;
import com.appointment.booking.service.BookingService;

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
     * Create a new booking (UPDATED - no userId required)
     * 
     * REQUEST BODY:
     * {
     *   "slotId": 1,
     *   "name": "John Doe",
     *   "phoneNumber": "0771234567",
     *   "nic": "123456789V",
     *   "email": "john@example.com",  // optional
     *   "age": 30,                     // optional
     *   "gender": "MALE",              // optional
     *   "patientNotes": "First visit"  // optional
     * }
     */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO request) {
        try {
            BookingDTO booking = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
    
    /**
     * NEW: GET /api/bookings/lookup
     * Get bookings by phone number and NIC
     * 
     * QUERY PARAMS:
     * - phoneNumber: User's phone number
     * - nic: User's NIC
     * 
     * EXAMPLE:
     * GET /api/bookings/lookup?phoneNumber=0771234567&nic=123456789V
     */
    @GetMapping("/lookup")
    public ResponseEntity<?> getBookingsByPhoneAndNic(
            @RequestParam String phoneNumber,
            @RequestParam String nic) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByPhoneAndNic(phoneNumber, nic);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }
    
    /**
     * NEW: GET /api/bookings/lookup/upcoming
     * Get upcoming bookings by phone number and NIC
     */
    @GetMapping("/lookup/upcoming")
    public ResponseEntity<?> getUpcomingBookingsByPhoneAndNic(
            @RequestParam String phoneNumber,
            @RequestParam String nic) {
        try {
            List<BookingDTO> bookings = bookingService.getUpcomingBookingsByPhoneAndNic(phoneNumber, nic);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }
    
    /**
     * DELETE /api/bookings/{id}/cancel
     * Cancel a booking (UPDATED - verify with phone + NIC)
     * 
     * QUERY PARAMS:
     * - phoneNumber: For verification
     * - nic: For verification
     */
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @RequestParam String phoneNumber,
            @RequestParam String nic) {
        try {
            BookingDTO booking = bookingService.cancelBooking(id, phoneNumber, nic);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
    
    /**
     * GET /api/bookings/{id}
     * Get single booking details
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}