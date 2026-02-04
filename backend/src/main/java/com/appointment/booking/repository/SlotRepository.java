package com.appointment.booking.repository;

import com.appointment.booking.entity.Slot;
import com.appointment.booking.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Slot Repository
 * 
 * MOST COMPLEX: Slots need filtering by date, doctor, hospital, availability
 */
@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    
    /**
     * Find available slots for a doctor on a specific date
     * 
     * WHY: Core booking flow - "Show me Dr. Smith's slots on Feb 5th"
     * isAvailable = true: Only show slots that aren't full
     * ORDER BY: Show morning slots first
     */
    List<Slot> findByDoctorAndSlotDateAndIsAvailableTrueOrderByStartTime(
        Doctor doctor, 
        LocalDate slotDate
    );
    
    /**
     * Find all slots for a doctor (regardless of date)
     * 
     * WHY: Admin view - "Show all of Dr. Smith's slots"
     */
    List<Slot> findByDoctorOrderBySlotDateAscStartTimeAsc(Doctor doctor);
    
    /**
     * CUSTOM @Query: Find available slots by hospital and date
     * 
     * WHY: "Show me all available slots at Apollo Hospital tomorrow"
     * JOINS: 
     * - Slot connects to Doctor (s.doctor = d)
     * - Doctor connects to Hospital (d.hospital.id = :hospitalId)
     * 
     * This is a 2-table JOIN query!
     */
    @Query("SELECT s FROM Slot s JOIN s.doctor d " +
           "WHERE d.hospital.id = :hospitalId " +
           "AND s.slotDate = :slotDate " +
           "AND s.isAvailable = true " +
           "ORDER BY s.startTime")
    List<Slot> findAvailableSlotsByHospitalAndDate(
        @Param("hospitalId") Long hospitalId,
        @Param("slotDate") LocalDate slotDate
    );
    
    /**
     * CUSTOM @Query: Find slots by hospital, specialization, and date
     * 
     * WHY: Advanced search - "Show me Cardiologist slots at Apollo tomorrow"
     * COMPLEX: 3-table logic (Slot -> Doctor -> Hospital)
     * 
     * SQL Equivalent:
     * SELECT slots.* FROM slots
     * JOIN doctors ON slots.doctor_id = doctors.id
     * JOIN hospitals ON doctors.hospital_id = hospitals.id
     * WHERE hospitals.id = ? 
     *   AND doctors.specialization = ?
     *   AND slots.slot_date = ?
     *   AND slots.is_available = true
     */
    @Query("SELECT s FROM Slot s JOIN s.doctor d " +
           "WHERE d.hospital.id = :hospitalId " +
           "AND LOWER(d.specialization) = LOWER(:specialization) " +
           "AND s.slotDate = :slotDate " +
           "AND s.isAvailable = true " +
           "ORDER BY s.startTime")
    List<Slot> findAvailableSlotsByHospitalSpecializationAndDate(
        @Param("hospitalId") Long hospitalId,
        @Param("specialization") String specialization,
        @Param("slotDate") LocalDate slotDate
    );
    
    /**
     * CUSTOM @Query: Find slots in a date range
     * 
     * WHY: "Show me next 7 days of slots"
     * BETWEEN: SQL range operator (startDate <= slotDate <= endDate)
     */
    @Query("SELECT s FROM Slot s WHERE s.doctor.id = :doctorId " +
           "AND s.slotDate BETWEEN :startDate AND :endDate " +
           "ORDER BY s.slotDate, s.startTime")
    List<Slot> findSlotsByDoctorAndDateRange(
        @Param("doctorId") Long doctorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}