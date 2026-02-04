package com.appointment.booking.repository;

import com.appointment.booking.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Hospital Repository
 * 
 * WHAT: Interface for database operations on Hospital entity
 * WHY JpaRepository<Hospital, Long>:
 *   - Hospital: Entity type we're working with
 *   - Long: Type of the primary key (id field)
 * 
 * AUTO-PROVIDED METHODS (we don't write these, Spring creates them):
 * - findAll() - Get all hospitals
 * - findById(id) - Get one hospital
 * - save(hospital) - Create or update
 * - deleteById(id) - Delete hospital
 * - count() - Count total hospitals
 */
@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    
    /**
     * CUSTOM QUERY: Find hospitals in a specific city
     * 
     * HOW IT WORKS: Spring reads the method name and creates SQL automatically!
     * Method name pattern: findBy + FieldName
     * Generated SQL: SELECT * FROM hospitals WHERE city = ?
     * 
     * EXAMPLE USAGE: 
     * List<Hospital> hospitals = hospitalRepository.findByCity("Colombo");
     */
    List<Hospital> findByCity(String city);
    
    /**
     * CUSTOM QUERY: Search hospitals by name (partial match)
     * 
     * WHY Containing: Allows partial matches (like SQL LIKE '%name%')
     * IgnoreCase: Case-insensitive search
     * Generated SQL: SELECT * FROM hospitals WHERE LOWER(name) LIKE LOWER('%?%')
     * 
     * EXAMPLE: findByNameContainingIgnoreCase("National")
     * Finds: "National Hospital", "International Hospital", "National Cancer Institute"
     */
    List<Hospital> findByNameContainingIgnoreCase(String name);
}