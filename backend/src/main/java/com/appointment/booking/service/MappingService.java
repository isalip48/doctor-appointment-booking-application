package com.appointment.booking.service;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.appointment.booking.dto.BookingDTO;
import com.appointment.booking.dto.DoctorDTO;
import com.appointment.booking.dto.DoctorSummaryDTO;
import com.appointment.booking.dto.HospitalDTO;
import com.appointment.booking.dto.SlotDTO;
import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.Doctor;
import com.appointment.booking.entity.Hospital;
import com.appointment.booking.entity.Slot;

@Service
public class MappingService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public HospitalDTO toHospitalDTO(Hospital hospital) {
        if (hospital == null) return null;
        return new HospitalDTO(
                hospital.getId(),
                hospital.getName(),
                hospital.getAddress(),
                hospital.getCity(),
                hospital.getPhoneNumber());
    }

    public DoctorSummaryDTO toDoctorSummaryDTO(Doctor doctor) {
        if (doctor == null) return null;
        return new DoctorSummaryDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization());
    }

    public DoctorDTO toDoctorDTO(Doctor doctor) {
        if (doctor == null) return null;
        return new DoctorDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getQualifications(),
                doctor.getExperienceYears(),
                doctor.getConsultationFee(),
                toHospitalDTO(doctor.getHospital()));
    }

    /**
     * UPDATED: Convert Slot to DTO with new fields
     */
    public SlotDTO toSlotDTO(Slot slot) {
        if (slot == null) return null;
        
        return new SlotDTO(
            slot.getId(),
            slot.getSlotDate().format(DATE_FORMATTER),
            slot.getConsultationStartTime().format(TIME_FORMATTER),
            slot.getNextAvailableTime().format(TIME_FORMATTER),      // NEW
            slot.getEstimatedEndTime().format(TIME_FORMATTER),       // NEW
            slot.getMaxBookingsPerDay(),
            slot.getCurrentBookings(),
            slot.getRemainingSlots(),                                 // NEW
            slot.getMinutesPerPatient(),
            slot.getIsAvailable(),
            toDoctorSummaryDTO(slot.getDoctor()),
            toHospitalDTO(slot.getDoctor().getHospital())
        );
    }

    /**
     * UPDATED: Use appointmentTime from booking
     */
    public BookingDTO toBookingDTO(Booking booking) {
        if (booking == null) return null;

        Slot slot = booking.getSlot();
        Doctor doctor = slot.getDoctor();
        Hospital hospital = doctor.getHospital();

        return new BookingDTO(
                booking.getId(),
                booking.getBookingTime().format(DATETIME_FORMATTER),
                booking.getStatus().toString(),
                booking.getPatientNotes(),
                booking.getAmountPaid(),
                slot.getSlotDate().format(DATE_FORMATTER),
                booking.getAppointmentTime().format(TIME_FORMATTER),  // UPDATED: Use stored time
                toDoctorSummaryDTO(doctor),
                toHospitalDTO(hospital));
    }
}