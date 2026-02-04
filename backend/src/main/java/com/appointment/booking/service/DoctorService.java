package com.appointment.booking.service;

import com.appointment.booking.dto.DoctorDTO;
import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Hospital;
import com.appointment.booking.repository.DoctorRepository;
import com.appointment.booking.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Doctor Service
 * 
 * RESPONSIBILITIES:
 * - Fetch doctors with various filters
 * - Handle doctor-hospital relationships
 */
@Service
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final MappingService mappingService;
    
    public DoctorService(DoctorRepository doctorRepository,
                        HospitalRepository hospitalRepository,
                        MappingService mappingService) {
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.mappingService = mappingService;
    }
    
    /**
     * Get all doctors
     */
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
            .stream()
            .map(mappingService::toDoctorDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get doctor by ID
     */
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        
        return mappingService.toDoctorDTO(doctor);
    }
    
    /**
     * Get doctors by hospital
     * 
     * USE CASE: User selects "Apollo Hospital", show all doctors there
     * 
     * FLOW:
     * 1. Fetch hospital entity
     * 2. Use hospital entity to find doctors
     * 3. Convert to DTOs
     */
    public List<DoctorDTO> getDoctorsByHospital(Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
            .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + hospitalId));
        
        return doctorRepository.findByHospital(hospital)
            .stream()
            .map(mappingService::toDoctorDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get doctors by specialization
     * 
     * USE CASE: "Show me all Cardiologists"
     */
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationIgnoreCase(specialization)
            .stream()
            .map(mappingService::toDoctorDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get doctors by hospital AND specialization
     * 
     * USE CASE: "Show me Cardiologists at Apollo Hospital"
     * COMPLEX: Combines two filters
     */
    public List<DoctorDTO> getDoctorsByHospitalAndSpecialization(Long hospitalId, String specialization) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
            .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + hospitalId));
        
        return doctorRepository.findByHospitalAndSpecializationIgnoreCase(hospital, specialization)
            .stream()
            .map(mappingService::toDoctorDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Get all unique specializations
     * 
     * USE CASE: Populate dropdown filter in UI
     * RETURNS: ["Cardiology", "Dermatology", "Pediatrics", ...]
     * 
     * WHY: No DTO needed - returning simple strings
     */
    public List<String> getAllSpecializations() {
        return doctorRepository.findAllSpecializations();
    }
    
    /**
     * Create new doctor (Admin function)
     * 
     * IMPORTANT: Must link doctor to existing hospital
     */
    public DoctorDTO createDoctor(DoctorDTO doctorDTO) {
        // Fetch the hospital this doctor will work at
        Hospital hospital = hospitalRepository.findById(doctorDTO.getHospital().getId())
            .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        Doctor doctor = new Doctor(
            null,  // ID will be generated
            doctorDTO.getName(),
            doctorDTO.getSpecialization(),
            doctorDTO.getQualifications(),
            doctorDTO.getExperienceYears(),
            doctorDTO.getConsultationFee(),
            hospital  // Link to hospital entity
        );
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        return mappingService.toDoctorDTO(savedDoctor);
    }
}