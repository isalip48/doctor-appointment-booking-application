package com.appointment.booking.repository;

import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Doctor Repository
 * 
 * COMPLEX QUERIES: When method names get too long, use @Query
 */
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    /**
     * METHOD NAME QUERY: Find doctors by hospital
     * 
     * WHY: Users want to see "Which doctors work at this hospital?"
     * Generated SQL: SELECT * FROM doctors WHERE hospital_id = ?
     */
    List<Doctor> findByHospital(Hospital hospital);
    
    /**
     * METHOD NAME QUERY: Find doctors by specialization
     * 
     * WHY: Users search "I need a Cardiologist"
     * IgnoreCase: "cardiology" matches "Cardiology"
     */
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    
    /**
     * METHOD NAME QUERY: Find doctors by hospital AND specialization
     * 
     * COMPLEX QUERY: Combines two conditions with AND
     * WHY: Users ask "Which Cardiologists work at Apollo Hospital?"
     * Generated SQL: SELECT * FROM doctors 
     *                WHERE hospital_id = ? AND LOWER(specialization) = LOWER(?)
     */
    List<Doctor> findByHospitalAndSpecializationIgnoreCase(Hospital hospital, String specialization);
    
    /**
     * CUSTOM @Query: Find doctors by hospital ID
     * 
     * WHY USE @Query: 
     * - More readable than long method names
     * - Can write exact SQL we want
     * - Better performance for complex queries
     * 
     * JPQL (Java Persistence Query Language):
     * - Similar to SQL but uses entity names (Doctor) not table names (doctors)
     * - :hospitalId is a parameter placeholder
     * 
     * @Param: Links method parameter to query placeholder
     */
    @Query("SELECT d FROM Doctor d WHERE d.hospital.id = :hospitalId")
    List<Doctor> findByHospitalId(@Param("hospitalId") Long hospitalId);
    
    /**
     * CUSTOM @Query: Find all unique specializations
     * 
     * WHY: For building a filter dropdown in UI
     * DISTINCT: Removes duplicates (many doctors share same specialization)
     * Returns: ["Cardiology", "Dermatology", "Pediatrics", ...]
     */
    @Query("SELECT DISTINCT d.specialization FROM Doctor d ORDER BY d.specialization")
    List<String> findAllSpecializations();
}