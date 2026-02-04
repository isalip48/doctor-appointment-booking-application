package com.appointment.booking.config;

import com.appointment.booking.entity.*;
import com.appointment.booking.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Initializer
 * 
 * WHY: Automatically populate database with sample data on first run
 * 
 * HOW IT WORKS:
 * - Implements CommandLineRunner interface
 * - Spring runs this AFTER application starts
 * - Checks if data exists (to avoid duplicates on restart)
 * - Creates sample hospitals, doctors, users, and slots
 */
@Component
public class DataInitializer implements CommandLineRunner {
    
    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SlotRepository slotRepository;
    
    public DataInitializer(HospitalRepository hospitalRepository,
                          DoctorRepository doctorRepository,
                          UserRepository userRepository,
                          SlotRepository slotRepository) {
        this.hospitalRepository = hospitalRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.slotRepository = slotRepository;
    }
    
    /**
     * This method runs when application starts
     * 
     * @param args: Command line arguments (unused)
     */
    @Override
    public void run(String... args) {
        // SAFETY CHECK: Don't add data if it already exists
        if (hospitalRepository.count() > 0) {
            System.out.println("Database already has data. Skipping initialization.");
            return;
        }
        
        System.out.println("Initializing database with sample data...");
        
        // STEP 1: Create Hospitals
        Hospital apollo = createHospital("Apollo Hospital", "123 Main Street", "Colombo", "0112345678");
        Hospital asiri = createHospital("Asiri Central Hospital", "456 Galle Road", "Colombo", "0112345679");
        Hospital nawaloka = createHospital("Nawaloka Hospital", "789 Baseline Road", "Colombo", "0112345680");
        
        // STEP 2: Create Doctors
        // Cardiologists
        Doctor cardio1 = createDoctor("Dr. Anil Fernando", "Cardiology", "MBBS, MD (Cardiology)", 
                                     15, 5000.0, apollo);
        Doctor cardio2 = createDoctor("Dr. Priya Silva", "Cardiology", "MBBS, MRCP", 
                                     10, 4500.0, asiri);
        
        // Dermatologists
        Doctor derm1 = createDoctor("Dr. Kasun Perera", "Dermatology", "MBBS, MD (Dermatology)", 
                                   12, 3500.0, apollo);
        Doctor derm2 = createDoctor("Dr. Nimali Jayasinghe", "Dermatology", "MBBS, Dip. Dermatology", 
                                   8, 3000.0, nawaloka);
        
        // Pediatricians
        Doctor pedia1 = createDoctor("Dr. Rohan Wickramasinghe", "Pediatrics", "MBBS, DCH", 
                                    20, 4000.0, asiri);
        Doctor pedia2 = createDoctor("Dr. Anushka Mendis", "Pediatrics", "MBBS, MD (Pediatrics)", 
                                    7, 3500.0, nawaloka);
        
        // General Practitioners
        Doctor gp1 = createDoctor("Dr. Sunil Gunawardena", "General Practice", "MBBS", 
                                 25, 2500.0, apollo);
        Doctor gp2 = createDoctor("Dr. Malini Rajapakse", "General Practice", "MBBS", 
                                 18, 2500.0, asiri);
        
        // STEP 3: Create Sample Users
        createUser("John Doe", "john@example.com", "0771234567", 30, User.Gender.MALE);
        createUser("Jane Smith", "jane@example.com", "0771234568", 28, User.Gender.FEMALE);
        createUser("Mike Johnson", "mike@example.com", "0771234569", 35, User.Gender.MALE);
        
        // STEP 4: Create Slots for next 7 days
        createSlotsForDoctor(cardio1, 7);
        createSlotsForDoctor(cardio2, 7);
        createSlotsForDoctor(derm1, 7);
        createSlotsForDoctor(derm2, 7);
        createSlotsForDoctor(pedia1, 7);
        createSlotsForDoctor(pedia2, 7);
        createSlotsForDoctor(gp1, 7);
        createSlotsForDoctor(gp2, 7);
        
        System.out.println("✅ Database initialized successfully!");
        System.out.println("📊 Created:");
        System.out.println("   - " + hospitalRepository.count() + " hospitals");
        System.out.println("   - " + doctorRepository.count() + " doctors");
        System.out.println("   - " + userRepository.count() + " users");
        System.out.println("   - " + slotRepository.count() + " slots");
    }
    
    /**
     * Helper: Create and save hospital
     */
    private Hospital createHospital(String name, String address, String city, String phone) {
        Hospital hospital = new Hospital(null, name, address, city, phone);
        return hospitalRepository.save(hospital);
    }
    
    /**
     * Helper: Create and save doctor
     */
    private Doctor createDoctor(String name, String specialization, String qualifications,
                               Integer experience, Double fee, Hospital hospital) {
        Doctor doctor = new Doctor(null, name, specialization, qualifications, 
                                  experience, fee, hospital);
        return doctorRepository.save(doctor);
    }
    
    /**
     * Helper: Create and save user
     */
    private User createUser(String name, String email, String phone, Integer age, User.Gender gender) {
        User user = new User(null, name, email, phone, age, gender);
        return userRepository.save(user);
    }
    
    /**
     * Helper: Create slots for a doctor for next N days
     * 
     * CREATES: Morning (9 AM - 12 PM) and Afternoon (2 PM - 5 PM) slots
     * Each slot is 30 minutes
     */
    private void createSlotsForDoctor(Doctor doctor, int days) {
        LocalDate today = LocalDate.now();
        List<Slot> slots = new ArrayList<>();
        
        // FOR EACH DAY
        for (int day = 0; day < days; day++) {
            LocalDate slotDate = today.plusDays(day);
            
            // MORNING SLOTS: 9:00 AM - 12:00 PM (every 30 min)
            LocalTime morningStart = LocalTime.of(9, 0);
            LocalTime morningEnd = LocalTime.of(12, 0);
            slots.addAll(createTimeSlots(doctor, slotDate, morningStart, morningEnd, 30));
            
            // AFTERNOON SLOTS: 2:00 PM - 5:00 PM (every 30 min)
            LocalTime afternoonStart = LocalTime.of(14, 0);
            LocalTime afternoonEnd = LocalTime.of(17, 0);
            slots.addAll(createTimeSlots(doctor, slotDate, afternoonStart, afternoonEnd, 30));
        }
        
        // BATCH SAVE: Save all slots at once (efficient)
        slotRepository.saveAll(slots);
    }
    
    /**
     * Helper: Create time slots between start and end time
     * 
     * EXAMPLE: createTimeSlots(doctor, date, 9:00, 12:00, 30)
     * CREATES: 9:00-9:30, 9:30-10:00, 10:00-10:30, ..., 11:30-12:00
     */
    private List<Slot> createTimeSlots(Doctor doctor, LocalDate date, 
                                      LocalTime start, LocalTime end, int durationMinutes) {
        List<Slot> slots = new ArrayList<>();
        LocalTime current = start;
        
        while (current.isBefore(end)) {
            LocalTime slotEnd = current.plusMinutes(durationMinutes);
            
            Slot slot = new Slot(
                null,
                date,
                current,
                slotEnd,
                1,  // totalSlots: 1 patient per time slot
                0,  // bookedSlots: 0 initially
                doctor
            );
            
            slots.add(slot);
            current = slotEnd;  // Move to next slot
        }
        
        return slots;
    }
}