package com.appointment.booking.service;

import com.appointment.booking.dto.HospitalDTO;
import com.appointment.booking.entity.Hospital;
import com.appointment.booking.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Hospital Service
 * 
 * WHY: Business logic for hospital operations
 * RESPONSIBILITIES:
 * - Fetch hospitals (all, by city, search)
 * - Convert entities to DTOs
 */
@Service
public class HospitalService {
    
    /**
     * DEPENDENCY INJECTION
     * WHY: Spring automatically provides these instances
     * BENEFIT: No need to write "new HospitalRepository()" - Spring manages it
     */
    private final HospitalRepository hospitalRepository;
    private final MappingService mappingService;
    
    /**
     * CONSTRUCTOR INJECTION (Recommended practice)
     * WHY: Makes dependencies explicit and enables easier testing
     * Spring calls this constructor and injects the dependencies
     */
    public HospitalService(HospitalRepository hospitalRepository, 
                          MappingService mappingService) {
        this.hospitalRepository = hospitalRepository;
        this.mappingService = mappingService;
    }
    
    /**
     * Get all hospitals
     * 
     * FLOW:
     * 1. Repository fetches all Hospital entities from database
     * 2. Stream API processes the list
     * 3. Map each Hospital to HospitalDTO
     * 4. Collect into a new list
     * 
     * WHY STREAM: Functional programming - clean, readable transformations
     */
    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll()           // List<Hospital>
            .stream()                                  // Stream<Hospital>
            .map(mappingService::toHospitalDTO)       // Stream<HospitalDTO>
            .collect(Collectors.toList());            // List<HospitalDTO>
    }
    
    /**
     * Get hospital by ID
     * 
     * WHY orElseThrow: 
     * - Repository returns Optional<Hospital> (might not exist)
     * - We convert it to Hospital or throw exception
     * - Controller catches exception and returns 404 to frontend
     */
    public HospitalDTO getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + id));
        
        return mappingService.toHospitalDTO(hospital);
    }
    
    /**
     * Get hospitals by city
     * 
     * USE CASE: "Show me all hospitals in Colombo"
     */
    public List<HospitalDTO> getHospitalsByCity(String city) {
        return hospitalRepository.findByCity(city)
            .stream()
            .map(mappingService::toHospitalDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Search hospitals by name
     * 
     * USE CASE: User types "Apollo" in search box
     * FINDS: "Apollo Hospital", "Apollo Speciality Hospital", etc.
     */
    public List<HospitalDTO> searchHospitalsByName(String name) {
        return hospitalRepository.findByNameContainingIgnoreCase(name)
            .stream()
            .map(mappingService::toHospitalDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Create new hospital (Admin function)
     * 
     * FLOW:
     * 1. Receive HospitalDTO from controller
     * 2. Convert to Hospital entity
     * 3. Save to database
     * 4. Convert saved entity back to DTO
     * 5. Return to controller
     * 
     * WHY save returns entity: Database generates the ID
     */
    public HospitalDTO createHospital(HospitalDTO hospitalDTO) {
        Hospital hospital = new Hospital(
            null,  // ID is null - database will generate it
            hospitalDTO.getName(),
            hospitalDTO.getAddress(),
            hospitalDTO.getCity(),
            hospitalDTO.getPhoneNumber()
        );
        
        Hospital savedHospital = hospitalRepository.save(hospital);
        return mappingService.toHospitalDTO(savedHospital);
    }
}