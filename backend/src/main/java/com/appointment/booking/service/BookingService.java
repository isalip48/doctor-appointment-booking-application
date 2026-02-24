package com.appointment.booking.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appointment.booking.dto.BookingDTO;
import com.appointment.booking.dto.BookingRequestDTO;
import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.entity.User;
import com.appointment.booking.repository.BookingRepository;
import com.appointment.booking.repository.SlotRepository;
import com.appointment.booking.repository.UserRepository;

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
     * Create booking - UPDATED for guest bookings
     * 
     * FLOW:
     * 1. Check if user exists (by phone + NIC)
     * 2. If not, create new user
     * 3. Book the slot
     * 4. Create booking record
     */
    @Transactional
    public BookingDTO createBooking(BookingRequestDTO request) {
        // Validate required fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            throw new RuntimeException("Phone number is required");
        }
        if (request.getNic() == null || request.getNic().trim().isEmpty()) {
            throw new RuntimeException("NIC is required");
        }
        
        // Get or create user
        User user = userRepository.findByPhoneNumberAndNic(
            request.getPhoneNumber(), 
            request.getNic()
        ).orElseGet(() -> {
            // Create new user
            User newUser = new User();
            newUser.setName(request.getName());
            newUser.setPhoneNumber(request.getPhoneNumber());
            newUser.setNic(request.getNic());
            newUser.setEmail(request.getEmail());
            newUser.setAge(request.getAge());
            
            if (request.getGender() != null) {
                try {
                    newUser.setGender(User.Gender.valueOf(request.getGender().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Invalid gender, leave as null
                }
            }
            
            return userRepository.save(newUser);
        });
        
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
        
        // Create booking
        Booking booking = new Booking(
            user,
            slot,
            LocalDateTime.now(),
            appointmentTime,
            Booking.BookingStatus.CONFIRMED
        );
        booking.setPatientNotes(request.getPatientNotes());
        booking.setAmountPaid(slot.getDoctor().getConsultationFee());
        
        Booking savedBooking = bookingRepository.save(booking);
        return mappingService.toBookingDTO(savedBooking);
    }
    
    /**
     * NEW: Get bookings by phone number and NIC
     * 
     * USE CASE: Guest users checking their bookings
     */
    public List<BookingDTO> getBookingsByPhoneAndNic(String phoneNumber, String nic) {
        User user = userRepository.findByPhoneNumberAndNic(phoneNumber, nic)
            .orElseThrow(() -> new RuntimeException("No bookings found for this phone number and NIC"));
        
        return bookingRepository.findByUserOrderByBookingTimeDesc(user)
            .stream()
            .map(mappingService::toBookingDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * NEW: Get upcoming bookings by phone and NIC
     */
    public List<BookingDTO> getUpcomingBookingsByPhoneAndNic(String phoneNumber, String nic) {
        User user = userRepository.findByPhoneNumberAndNic(phoneNumber, nic)
            .orElseThrow(() -> new RuntimeException("No bookings found for this phone number and NIC"));
        
        LocalDate today = LocalDate.now();
        return bookingRepository.findUpcomingBookingsByUser(user.getId(), today)
            .stream()
            .map(mappingService::toBookingDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Cancel booking - UPDATED to verify phone + NIC
     */
    @Transactional
    public BookingDTO cancelBooking(Long bookingId, String phoneNumber, String nic) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Verify ownership
        User user = booking.getUser();
        if (!user.getPhoneNumber().equals(phoneNumber) || !user.getNic().equals(nic)) {
            throw new RuntimeException("Invalid credentials - cannot cancel this booking");
        }
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Only confirmed bookings can be cancelled");
        }
        
        // Free up the slot
        Slot slot = booking.getSlot();
        slot.cancelSlot();
        slotRepository.save(slot);
        
        // Update booking status
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);
        
        return mappingService.toBookingDTO(cancelledBooking);
    }
    
    // Keep existing methods for backward compatibility
    public List<BookingDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByUserOrderByBookingTimeDesc(user)
            .stream()
            .map(mappingService::toBookingDTO)
            .collect(Collectors.toList());
    }
    
    public BookingDTO getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mappingService.toBookingDTO(booking);
    }
}