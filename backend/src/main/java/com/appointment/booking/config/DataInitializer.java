package com.appointment.booking.config;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Hospital;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.entity.User;
import com.appointment.booking.repository.DoctorRepository;
import com.appointment.booking.repository.HospitalRepository;
import com.appointment.booking.repository.SlotRepository;
import com.appointment.booking.repository.UserRepository;

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
    
    @Override
    public void run(String... args) {
        if (hospitalRepository.count() > 0) {
            System.out.println("Database already has data. Skipping initialization.");
            return;
        }
        
        System.out.println("Initializing database with sample data...");
        
        // Create Hospitals
        Hospital apollo = createHospital("Apollo Hospital", "123 Main Street", "Colombo", "0112345678");
        Hospital asiri = createHospital("Asiri Central Hospital", "456 Galle Road", "Colombo", "0112345679");
        Hospital nawaloka = createHospital("Nawaloka Hospital", "789 Baseline Road", "Colombo", "0112345680");
        
        // Create Doctors
        Doctor cardio1 = createDoctor("Dr. Anil Fernando", "Cardiology", "MBBS, MD (Cardiology)", 15, 5000.0, apollo);
        Doctor cardio2 = createDoctor("Dr. Priya Silva", "Cardiology", "MBBS, MRCP", 10, 4500.0, asiri);
        Doctor derm1 = createDoctor("Dr. Kasun Perera", "Dermatology", "MBBS, MD (Dermatology)", 12, 3500.0, apollo);
        Doctor derm2 = createDoctor("Dr. Nimali Jayasinghe", "Dermatology", "MBBS, Dip. Dermatology", 8, 3000.0, nawaloka);
        Doctor pedia1 = createDoctor("Dr. Rohan Wickramasinghe", "Pediatrics", "MBBS, DCH", 20, 4000.0, asiri);
        Doctor pedia2 = createDoctor("Dr. Anushka Mendis", "Pediatrics", "MBBS, MD (Pediatrics)", 7, 3500.0, nawaloka);
        Doctor gp1 = createDoctor("Dr. Sunil Gunawardena", "General Practice", "MBBS", 25, 2500.0, apollo);
        Doctor gp2 = createDoctor("Dr. Malini Rajapakse", "General Practice", "MBBS", 18, 2500.0, asiri);
        
        // Create Users
        createUser("John Doe", "john@example.com", "0771234567", 30, User.Gender.MALE);
        createUser("Jane Smith", "jane@example.com", "0771234568", 28, User.Gender.FEMALE);
        createUser("Mike Johnson", "mike@example.com", "0771234569", 35, User.Gender.MALE);
        
        // Create Slots - NEW LOGIC: One slot per doctor per day
        createSlotsForDoctor(cardio1, 14);
        createSlotsForDoctor(cardio2, 14);
        createSlotsForDoctor(derm1, 14);
        createSlotsForDoctor(derm2, 14);
        createSlotsForDoctor(pedia1, 14);
        createSlotsForDoctor(pedia2, 14);
        createSlotsForDoctor(gp1, 14);
        createSlotsForDoctor(gp2, 14);
        
        System.out.println("✅ Database initialized successfully!");
        System.out.println("📊 Created:");
        System.out.println("   - " + hospitalRepository.count() + " hospitals");
        System.out.println("   - " + doctorRepository.count() + " doctors");
        System.out.println("   - " + userRepository.count() + " users");
        System.out.println("   - " + slotRepository.count() + " slots");
    }
    
    private Hospital createHospital(String name, String address, String city, String phone) {
        Hospital hospital = new Hospital(null, name, address, city, phone);
        return hospitalRepository.save(hospital);
    }
    
    private Doctor createDoctor(String name, String specialization, String qualifications,
                               Integer experience, Double fee, Hospital hospital) {
        Doctor doctor = new Doctor(null, name, specialization, qualifications, 
                                  experience, fee, hospital);
        return doctorRepository.save(doctor);
    }
    
    private User createUser(String name, String email, String phone, Integer age, User.Gender gender) {
        User user = new User(null, name, email, phone, age, gender);
        return userRepository.save(user);
    }
    
    /**
     * NEW LOGIC: Create ONE slot per doctor per day
     * Each slot holds 30 bookings starting at 9:00 AM
     */
    private void createSlotsForDoctor(Doctor doctor, int days) {
        LocalDate today = LocalDate.now();
        List<Slot> slots = new ArrayList<>();
        
        for (int day = 0; day < days; day++) {
            LocalDate slotDate = today.plusDays(day);
            
            // Create ONE slot starting at 9:00 AM with capacity for 30 bookings
            Slot slot = new Slot(
                null,
                slotDate,
                LocalTime.of(9, 0),  // Start at 9:00 AM
                doctor
            );
            
            slots.add(slot);
        }
        
        slotRepository.saveAll(slots);
    }
}