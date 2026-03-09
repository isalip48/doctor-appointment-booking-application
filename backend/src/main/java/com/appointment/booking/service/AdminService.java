package com.appointment.booking.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appointment.booking.dto.admin.BulkDoctorImportRequestDTO;
import com.appointment.booking.dto.admin.DoctorAdminDTO;
import com.appointment.booking.dto.admin.HospitalDTO;
import com.appointment.booking.dto.admin.SlotGenerationRequestDTO;
import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Hospital;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.repository.BookingRepository;
import com.appointment.booking.repository.DoctorRepository;
import com.appointment.booking.repository.HospitalRepository;
import com.appointment.booking.repository.SlotRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;

    // ============ HOSPITAL MANAGEMENT ============

    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(this::convertHospitalToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public HospitalDTO createHospital(HospitalDTO hospitalDTO) {
        Hospital hospital = new Hospital();
        hospital.setName(hospitalDTO.getName());
        hospital.setAddress(hospitalDTO.getAddress());
        hospital.setCity(hospitalDTO.getCity());
        hospital.setPhoneNumber(hospitalDTO.getPhoneNumber());
        
        Hospital saved = hospitalRepository.save(hospital);
        return convertHospitalToDTO(saved);
    }

    // ============ DOCTOR MANAGEMENT ============

    public List<DoctorAdminDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DoctorAdminDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToDTO(doctor);
    }

    @Transactional
    public DoctorAdminDTO createDoctor(DoctorAdminDTO doctorDTO) {
        Doctor doctor = new Doctor();
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setQualifications(doctorDTO.getQualifications());
        doctor.setExperienceYears(doctorDTO.getExperienceYears());
        doctor.setConsultationFee(doctorDTO.getConsultationFee());
        
        // Set hospital relationship
        if (doctorDTO.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(doctorDTO.getHospitalId())
                    .orElseThrow(() -> new RuntimeException("Hospital not found"));
            doctor.setHospital(hospital);
        }
        
        Doctor saved = doctorRepository.save(doctor);
        return convertToDTO(saved);
    }

    @Transactional
    public DoctorAdminDTO updateDoctor(Long id, DoctorAdminDTO doctorDTO) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        doctor.setName(doctorDTO.getName());
        doctor.setSpecialization(doctorDTO.getSpecialization());
        doctor.setQualifications(doctorDTO.getQualifications());
        doctor.setExperienceYears(doctorDTO.getExperienceYears());
        doctor.setConsultationFee(doctorDTO.getConsultationFee());
        
        // Update hospital relationship
        if (doctorDTO.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(doctorDTO.getHospitalId())
                    .orElseThrow(() -> new RuntimeException("Hospital not found"));
            doctor.setHospital(hospital);
        }
        
        Doctor updated = doctorRepository.save(doctor);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    @Transactional
    public Map<String, Object> bulkImportDoctors(BulkDoctorImportRequestDTO request) {
        List<Doctor> doctors = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        for (var dto : request.getDoctors()) {
            try {
                // Validate
                if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                    errors.add("Doctor name is required");
                    continue;
                }
                if (dto.getSpecialization() == null || dto.getSpecialization().trim().isEmpty()) {
                    errors.add("Specialization is required for " + dto.getName());
                    continue;
                }

                Doctor doctor = new Doctor();
                doctor.setName(dto.getName());
                doctor.setSpecialization(dto.getSpecialization());
                doctor.setQualifications(dto.getQualifications());
                doctor.setExperienceYears(dto.getExperienceYears());
                doctor.setConsultationFee(dto.getConsultationFee());
                
                // Find or create hospital by name
                if (dto.getHospitalName() != null && !dto.getHospitalName().trim().isEmpty()) {
                    Hospital hospital = hospitalRepository.findByName(dto.getHospitalName())
                            .orElseGet(() -> {
                                Hospital newHospital = new Hospital();
                                newHospital.setName(dto.getHospitalName());
                                newHospital.setAddress("To be updated");
                                newHospital.setCity("To be updated");
                                return hospitalRepository.save(newHospital);
                            });
                    doctor.setHospital(hospital);
                }
                
                doctors.add(doctor);
                successCount++;
            } catch (Exception e) {
                errors.add("Error importing " + dto.getName() + ": " + e.getMessage());
            }
        }

        doctorRepository.saveAll(doctors);

        Map<String, Object> result = new HashMap<>();
        result.put("success", successCount);
        result.put("failed", errors.size());
        result.put("errors", errors);
        result.put("message", successCount + " doctors imported successfully");
        
        return result;
    }

    // ============ SLOT MANAGEMENT ============

    @Transactional
    public Map<String, Object> generateSlots(SlotGenerationRequestDTO request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Slot> slots = new ArrayList<>();
        LocalDate currentDate = request.getStartDate();
        int totalGenerated = 0;

        // Default values
        Integer maxBookings = request.getMaxBookingsPerDay() != null ? 
            request.getMaxBookingsPerDay() : 30;
        Integer minutesPerPatient = request.getMinutesPerPatient() != null ? 
            request.getMinutesPerPatient() : 10;
        LocalTime startTime = request.getConsultationStartTime() != null ? 
            request.getConsultationStartTime() : LocalTime.of(9, 0);

        while (!currentDate.isAfter(request.getEndDate())) {
            // Check if slot already exists for this doctor on this date
            boolean slotExists = slotRepository.existsByDoctorAndSlotDate(doctor, currentDate);
            
            if (!slotExists) {
                Slot slot = new Slot();
                slot.setDoctor(doctor);
                slot.setSlotDate(currentDate);
                slot.setConsultationStartTime(startTime);
                slot.setMaxBookingsPerDay(maxBookings);
                slot.setCurrentBookings(0);
                slot.setMinutesPerPatient(minutesPerPatient);
                slot.setIsAvailable(true);
                
                slots.add(slot);
                totalGenerated++;
            }
            
            currentDate = currentDate.plusDays(1);
        }

        if (!slots.isEmpty()) {
            slotRepository.saveAll(slots);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("slotsGenerated", totalGenerated);
        result.put("doctor", doctor.getName());
        result.put("dateRange", request.getStartDate() + " to " + request.getEndDate());
        result.put("maxBookingsPerDay", maxBookings);
        result.put("minutesPerPatient", minutesPerPatient);
        result.put("consultationStartTime", startTime.toString());
        
        return result;
    }

    public List<Slot> getSlots(Long doctorId, String date) {
        if (doctorId != null && date != null) {
            LocalDate localDate = LocalDate.parse(date);
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return slotRepository.findByDoctorAndSlotDate(doctor, localDate)
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        } else if (doctorId != null) {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return slotRepository.findByDoctor(doctor);
        } else if (date != null) {
            LocalDate localDate = LocalDate.parse(date);
            return slotRepository.findBySlotDate(localDate);
        } else {
            return slotRepository.findAll();
        }
    }

    @Transactional
    public void deleteSlot(Long id) {
        slotRepository.deleteById(id);
    }

    // ============ BOOKING MANAGEMENT ============

    public List<Booking> getAllBookings(String status) {
        if (status != null && !status.isEmpty()) {
            // Assuming you have a status field in Booking
            return bookingRepository.findAll().stream()
                    .filter(b -> status.equalsIgnoreCase("CONFIRMED"))
                    .collect(Collectors.toList());
        }
        return bookingRepository.findAll();
    }

    public Map<String, Object> getBookingStats() {
        long totalBookings = bookingRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalBookings);
        stats.put("upcoming", totalBookings); // Adjust based on your logic
        stats.put("cancelled", 0); // Adjust based on your logic
        stats.put("completed", 0); // Adjust based on your logic
        
        return stats;
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Make slot available again
        if (booking.getSlot() != null) {
            Slot slot = booking.getSlot();
            slot.cancelSlot(); // Uses your custom cancelSlot method
            slotRepository.save(slot);
        }
        
        // Delete the booking
        bookingRepository.delete(booking);
    }

    // ============ DASHBOARD STATS ============

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("totalSlots", slotRepository.count());
        stats.put("availableSlots", slotRepository.countByIsAvailableTrue());
        stats.put("totalBookings", bookingRepository.count());
        
        return stats;
    }

    // ============ HELPER METHODS ============

    private DoctorAdminDTO convertToDTO(Doctor doctor) {
        return new DoctorAdminDTO(
            doctor.getId(),
            doctor.getName(),
            doctor.getSpecialization(),
            doctor.getQualifications(),
            doctor.getExperienceYears(),
            doctor.getConsultationFee(),
            doctor.getHospital() != null ? doctor.getHospital().getId() : null,
            doctor.getHospital() != null ? doctor.getHospital().getName() : null
        );
    }

    private HospitalDTO convertHospitalToDTO(Hospital hospital) {
        return new HospitalDTO(
            hospital.getId(),
            hospital.getName(),
            hospital.getAddress(),
            hospital.getCity(),
            hospital.getPhoneNumber()
        );
    }
}