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
        Hospital durdans = createHospital("Durdans Hospital", "3 Alfred Place", "Colombo", "0112345681");
        Hospital lanka = createHospital("Lanka Hospitals", "578 Elvitigala Mawatha", "Colombo", "0112345682");
        Hospital oasis = createHospital("Oasis Hospital", "65 Horton Place", "Colombo", "0112345683");
        Hospital hemas = createHospital("Hemas Hospital", "389 Negombo Road", "Wattala", "0112345684");
        Hospital central = createHospital("Central Hospital", "114 Norris Canal Road", "Colombo", "0112345685");
        
        // Create Cardiology Doctors
        Doctor cardio1 = createDoctor("Dr. Anil Fernando", "Cardiology", "MBBS, MD (Cardiology), FRCP", 15, 5000.0, apollo);
        Doctor cardio2 = createDoctor("Dr. Priya Silva", "Cardiology", "MBBS, MRCP, PhD", 10, 4500.0, asiri);
        Doctor cardio3 = createDoctor("Dr. Chaminda Wijekoon", "Cardiology", "MBBS, MD, DM (Cardiology)", 18, 5500.0, nawaloka);
        Doctor cardio4 = createDoctor("Dr. Nishanthi Perera", "Cardiology", "MBBS, MD (Cardiology)", 12, 4800.0, durdans);
        Doctor cardio5 = createDoctor("Dr. Ranjith Jayawardena", "Cardiology", "MBBS, MRCP, FACC", 20, 6000.0, lanka);
        
        // Create Dermatology Doctors
        Doctor derm1 = createDoctor("Dr. Kasun Perera", "Dermatology", "MBBS, MD (Dermatology)", 12, 3500.0, apollo);
        Doctor derm2 = createDoctor("Dr. Nimali Jayasinghe", "Dermatology", "MBBS, Dip. Dermatology", 8, 3000.0, nawaloka);
        Doctor derm3 = createDoctor("Dr. Sanjeewa Rathnayake", "Dermatology", "MBBS, MD, MRCP", 14, 4000.0, asiri);
        Doctor derm4 = createDoctor("Dr. Dulani Fonseka", "Dermatology", "MBBS, Dip. Dermatology, MSc", 9, 3200.0, oasis);
        Doctor derm5 = createDoctor("Dr. Harsha Gunasekara", "Dermatology", "MBBS, MD (Dermatology)", 11, 3600.0, hemas);
        
        // Create Pediatrics Doctors
        Doctor pedia1 = createDoctor("Dr. Rohan Wickramasinghe", "Pediatrics", "MBBS, DCH, MD", 20, 4000.0, asiri);
        Doctor pedia2 = createDoctor("Dr. Anushka Mendis", "Pediatrics", "MBBS, MD (Pediatrics)", 7, 3500.0, nawaloka);
        Doctor pedia3 = createDoctor("Dr. Samanthi De Silva", "Pediatrics", "MBBS, DCH, MRCP", 15, 4200.0, apollo);
        Doctor pedia4 = createDoctor("Dr. Upul Senarath", "Pediatrics", "MBBS, MD, FRACP", 22, 4500.0, lanka);
        Doctor pedia5 = createDoctor("Dr. Madhavi Wijesinghe", "Pediatrics", "MBBS, DCH, Dip. Child Health", 10, 3800.0, durdans);
        Doctor pedia6 = createDoctor("Dr. Asanka Fernando", "Pediatrics", "MBBS, MD (Pediatrics)", 8, 3600.0, central);
        
        // Create General Practice Doctors
        Doctor gp1 = createDoctor("Dr. Sunil Gunawardena", "General Practice", "MBBS, MRCGP", 25, 2500.0, apollo);
        Doctor gp2 = createDoctor("Dr. Malini Rajapakse", "General Practice", "MBBS, Dip. Family Medicine", 18, 2500.0, asiri);
        Doctor gp3 = createDoctor("Dr. Buddhika Samaraweera", "General Practice", "MBBS", 22, 2300.0, nawaloka);
        Doctor gp4 = createDoctor("Dr. Chandrika Bandara", "General Practice", "MBBS, MRCGP", 16, 2600.0, oasis);
        Doctor gp5 = createDoctor("Dr. Gamini Herath", "General Practice", "MBBS, Dip. Family Medicine", 20, 2400.0, hemas);
        Doctor gp6 = createDoctor("Dr. Nayani Wijeratne", "General Practice", "MBBS", 12, 2200.0, central);
        Doctor gp7 = createDoctor("Dr. Tharaka Perera", "General Practice", "MBBS, MRCGP", 14, 2500.0, durdans);
        Doctor gp8 = createDoctor("Dr. Shyamali Gunaratne", "General Practice", "MBBS, Dip. Family Medicine", 19, 2600.0, lanka);
        
        // Create Orthopedics Doctors
        Doctor ortho1 = createDoctor("Dr. Mahinda Amarasinghe", "Orthopedics", "MBBS, MS (Orthopedics), FRCS", 17, 5500.0, apollo);
        Doctor ortho2 = createDoctor("Dr. Lasantha Wickramaratne", "Orthopedics", "MBBS, MS, FRCS", 19, 6000.0, asiri);
        Doctor ortho3 = createDoctor("Dr. Gayani Kumarasinghe", "Orthopedics", "MBBS, MS (Orthopedics)", 13, 5200.0, nawaloka);
        Doctor ortho4 = createDoctor("Dr. Sudarshana Perera", "Orthopedics", "MBBS, MS, D.Orth", 16, 5800.0, lanka);
        
        // Create ENT Doctors
        Doctor ent1 = createDoctor("Dr. Dilshan Liyanage", "ENT", "MBBS, MS (ENT), FRCS", 14, 4500.0, apollo);
        Doctor ent2 = createDoctor("Dr. Sachini Weerasinghe", "ENT", "MBBS, MS (ENT)", 11, 4200.0, asiri);
        Doctor ent3 = createDoctor("Dr. Dinesh Rajapaksa", "ENT", "MBBS, DLO, MS", 16, 4800.0, durdans);
        Doctor ent4 = createDoctor("Dr. Ayesha Samarawickrama", "ENT", "MBBS, MS (ENT), FRCS", 12, 4600.0, oasis);
        
        // Create Gynecology Doctors
        Doctor gyno1 = createDoctor("Dr. Sharmila Ratnayake", "Gynecology", "MBBS, MD, MRCOG", 18, 5000.0, apollo);
        Doctor gyno2 = createDoctor("Dr. Kumari Siriwardena", "Gynecology", "MBBS, MS (O&G), FRCOG", 21, 5500.0, asiri);
        Doctor gyno3 = createDoctor("Dr. Dilini Karunaratne", "Gynecology", "MBBS, MD (O&G), MRCOG", 15, 4800.0, nawaloka);
        Doctor gyno4 = createDoctor("Dr. Jayanthi Fernando", "Gynecology", "MBBS, MS (O&G)", 13, 4600.0, lanka);
        Doctor gyno5 = createDoctor("Dr. Anusha Wickremasinghe", "Gynecology", "MBBS, MD, MRCOG", 17, 5200.0, durdans);
        
        // Create Neurology Doctors
        Doctor neuro1 = createDoctor("Dr. Ajith Gunasekera", "Neurology", "MBBS, MD (Neurology), FRCP", 20, 6500.0, apollo);
        Doctor neuro2 = createDoctor("Dr. Ramani Dissanayake", "Neurology", "MBBS, MD, DM (Neurology)", 16, 6000.0, asiri);
        Doctor neuro3 = createDoctor("Dr. Bandula Wijesinghe", "Neurology", "MBBS, MD (Neurology)", 14, 5800.0, lanka);
        
        // Create Ophthalmology Doctors
        Doctor ophthal1 = createDoctor("Dr. Nimal Senanayake", "Ophthalmology", "MBBS, DO, MS (Ophth)", 19, 4500.0, apollo);
        Doctor ophthal2 = createDoctor("Dr. Lakshmi Jayawardena", "Ophthalmology", "MBBS, DO, FRCS", 15, 4800.0, asiri);
        Doctor ophthal3 = createDoctor("Dr. Prasanna Alwis", "Ophthalmology", "MBBS, MS (Ophth)", 12, 4200.0, nawaloka);
        Doctor ophthal4 = createDoctor("Dr. Thilini Samarasinghe", "Ophthalmology", "MBBS, DO, MS", 10, 4000.0, oasis);
        
        // Create Psychiatry Doctors
        Doctor psych1 = createDoctor("Dr. Aruna Mahendra", "Psychiatry", "MBBS, MD (Psychiatry), MRCPsych", 16, 5000.0, apollo);
        Doctor psych2 = createDoctor("Dr. Nalini Mendis", "Psychiatry", "MBBS, MD (Psychiatry)", 13, 4700.0, asiri);
        Doctor psych3 = createDoctor("Dr. Roshan De Mel", "Psychiatry", "MBBS, DPM, MRCPsych", 18, 5300.0, durdans);
        
        // Create Oncology Doctors
        Doctor onco1 = createDoctor("Dr. Ananda Jayasuriya", "Oncology", "MBBS, MD (Oncology), MRCP", 20, 7000.0, apollo);
        Doctor onco2 = createDoctor("Dr. Shalini Perera", "Oncology", "MBBS, MD, DM (Oncology)", 17, 6800.0, asiri);
        Doctor onco3 = createDoctor("Dr. Chathura Rathnayake", "Oncology", "MBBS, MD (Oncology)", 14, 6500.0, lanka);
        
        // Create Users
        createUser("John Doe", "john@example.com", "0771234567", 30, User.Gender.MALE);
        createUser("Jane Smith", "jane@example.com", "0771234568", 28, User.Gender.FEMALE);
        createUser("Mike Johnson", "mike@example.com", "0771234569", 35, User.Gender.MALE);
        createUser("Sarah Williams", "sarah@example.com", "0771234570", 42, User.Gender.FEMALE);
        createUser("David Brown", "david@example.com", "0771234571", 38, User.Gender.MALE);
        createUser("Emily Davis", "emily@example.com", "0771234572", 25, User.Gender.FEMALE);
        createUser("Chris Wilson", "chris@example.com", "0771234573", 45, User.Gender.MALE);
        createUser("Lisa Anderson", "lisa@example.com", "0771234574", 33, User.Gender.FEMALE);
        createUser("Kevin Taylor", "kevin@example.com", "0771234575", 29, User.Gender.MALE);
        createUser("Michelle Thomas", "michelle@example.com", "0771234576", 37, User.Gender.FEMALE);
        createUser("Robert Martinez", "robert@example.com", "0771234577", 41, User.Gender.MALE);
        createUser("Amanda Garcia", "amanda@example.com", "0771234578", 31, User.Gender.FEMALE);
        createUser("Daniel Rodriguez", "daniel@example.com", "0771234579", 27, User.Gender.MALE);
        createUser("Jessica Lee", "jessica@example.com", "0771234580", 34, User.Gender.FEMALE);
        createUser("Matthew White", "matthew@example.com", "0771234581", 39, User.Gender.MALE);
        
        // Create Slots for all doctors (14 days ahead)
        List<Doctor> allDoctors = doctorRepository.findAll();
        for (Doctor doctor : allDoctors) {
            createSlotsForDoctor(doctor, 14);
        }
        
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
     * Create ONE slot per doctor per day
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