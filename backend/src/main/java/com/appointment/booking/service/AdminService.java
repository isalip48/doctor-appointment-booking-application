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
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
        return convertToDTO(doctor);
    }

    @Transactional
    public DoctorAdminDTO createDoctor(DoctorAdminDTO doctorDTO) {
        Doctor doctor = new Doctor();
        copyDtoToEntity(doctorDTO, doctor);

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

        copyDtoToEntity(doctorDTO, doctor);

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
                if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                    errors.add("Doctor name is required");
                    continue;
                }

                Doctor doctor = new Doctor();
                doctor.setName(dto.getName());
                doctor.setSpecialization(dto.getSpecialization());
                doctor.setQualifications(dto.getQualifications());
                doctor.setExperienceYears(dto.getExperienceYears());
                doctor.setConsultationFee(dto.getConsultationFee());

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

        List<Slot> slotsToSave = new ArrayList<>();
        LocalDate currentDate = request.getStartDate();
        int totalGenerated = 0;

        // Apply Entity constraints
        LocalTime startTime = request.getConsultationStartTime() != null ? request.getConsultationStartTime()
                : LocalTime.of(9, 0);

        while (!currentDate.isAfter(request.getEndDate())) {
            // Respect the Unique Constraint (doctor_id + slot_date)
            if (!slotRepository.existsByDoctorAndSlotDate(doctor, currentDate)) {
                // Using the specific constructor from your Entity
                Slot slot = new Slot(null, currentDate, startTime, doctor);
                slotsToSave.add(slot);
                totalGenerated++;
            }
            currentDate = currentDate.plusDays(1);
        }

        if (!slotsToSave.isEmpty()) {
            slotRepository.saveAll(slotsToSave);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("slotsGenerated", totalGenerated);
        result.put("doctor", doctor.getName());
        result.put("dateRange", request.getStartDate() + " to " + request.getEndDate());
        return result;
    }

    /**
     * FIXED: This method now ensures that even if findByDoctorAndSlotDate
     * returns an Optional, it is flattened into a List so the frontend
     * always receives an array of objects containing the 'doctor' property.
     */
    public List<Slot> getSlots(Long doctorId, String date) {
        if (doctorId != null && date != null) {
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return slotRepository.findByDoctorAndSlotDate(doctor, LocalDate.parse(date))
                    .map(List::of)
                    .orElse(Collections.emptyList());

        } else if (doctorId != null) {
            // ← was getReferenceById() which throws outside a transaction
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            return slotRepository.findByDoctor(doctor);

        } else if (date != null) {
            return slotRepository.findBySlotDate(LocalDate.parse(date));

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
        List<Booking> all = bookingRepository.findAll();
        if (status != null && !status.trim().isEmpty()) {
            return all.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }
        return all;
    }

    public Map<String, Object> getBookingStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", bookingRepository.count());
        // Add more specific counts if your Booking entity has a status field
        return stats;
    }

    @Transactional
    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getSlot() != null) {
            Slot slot = booking.getSlot();
            slot.cancelSlot(); // Uses logic: currentBookings--
            slotRepository.save(slot);
        }
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

    // ============ HELPERS ============

    private void copyDtoToEntity(DoctorAdminDTO dto, Doctor entity) {
        entity.setName(dto.getName());
        entity.setSpecialization(dto.getSpecialization());
        entity.setQualifications(dto.getQualifications());
        entity.setExperienceYears(dto.getExperienceYears());
        entity.setConsultationFee(dto.getConsultationFee());
    }

    private DoctorAdminDTO convertToDTO(Doctor doctor) {
        return new DoctorAdminDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getQualifications(),
                doctor.getExperienceYears(),
                doctor.getConsultationFee(),
                doctor.getHospital() != null ? doctor.getHospital().getId() : null,
                doctor.getHospital() != null ? doctor.getHospital().getName() : null);
    }

    private HospitalDTO convertHospitalToDTO(Hospital hospital) {
        return new HospitalDTO(
                hospital.getId(),
                hospital.getName(),
                hospital.getAddress(),
                hospital.getCity(),
                hospital.getPhoneNumber());
    }
}