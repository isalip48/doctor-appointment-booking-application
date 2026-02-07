package com.appointment.booking.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Slot;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    /**
     * Find slot for a doctor on a specific date
     * NEW: One slot per doctor per day (holds all 30 bookings)
     */
    Optional<Slot> findByDoctorAndSlotDate(Doctor doctor, LocalDate slotDate);

    /**
     * Find available slots by date across all doctors
     */
    List<Slot> findBySlotDateAndIsAvailableTrueOrderByConsultationStartTime(LocalDate slotDate);

    /**
     * Search by doctor name and date
     */
    @Query("SELECT s FROM Slot s JOIN s.doctor d " +
            "WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :doctorName, '%')) " +
            "AND s.slotDate = :date " +
            "AND s.isAvailable = true " +
            "ORDER BY s.consultationStartTime")
    List<Slot> searchByDoctorNameAndDate(
            @Param("doctorName") String doctorName,
            @Param("date") LocalDate date);

    /**
     * Search by specialization and date
     */
    @Query("SELECT s FROM Slot s JOIN s.doctor d " +
            "WHERE LOWER(d.specialization) = LOWER(:specialization) " +
            "AND s.slotDate = :date " +
            "AND s.isAvailable = true " +
            "ORDER BY d.hospital.name, s.consultationStartTime")
    List<Slot> searchBySpecializationAndDate(
            @Param("specialization") String specialization,
            @Param("date") LocalDate date);
}