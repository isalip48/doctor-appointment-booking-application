package com.appointment.booking.dto;

/**
 * Booking Data Transfer Object
 * 
 * WHY: Complete booking information for "My Appointments" page
 * CONTAINS: User info + Slot info + Doctor info + Hospital info
 */
public class BookingDTO {
    private Long id;
    
    /**
     * WHY String: Frontend displays "Booked on Feb 4, 2024 at 10:30 AM"
     */
    private String bookingTime;
    
    private String status;
    private String patientNotes;
    private Double amountPaid;
    
    /**
     * APPOINTMENT DETAILS: When and where
     */
    private String appointmentDate;
    private String appointmentTime;
    
    /**
     * NESTED DTOs: All context needed to display booking
     * EXAMPLE UI:
     * "Dr. Smith (Cardiology)
     *  Apollo Hospital, Colombo
     *  Feb 10, 2024 at 9:00 AM
     *  Status: Confirmed"
     */
    private DoctorSummaryDTO doctor;
    private HospitalDTO hospital;
    
    // Constructors
    public BookingDTO() {}
    
    public BookingDTO(Long id, String bookingTime, String status, String patientNotes,
                      Double amountPaid, String appointmentDate, String appointmentTime,
                      DoctorSummaryDTO doctor, HospitalDTO hospital) {
        this.id = id;
        this.bookingTime = bookingTime;
        this.status = status;
        this.patientNotes = patientNotes;
        this.amountPaid = amountPaid;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.doctor = doctor;
        this.hospital = hospital;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBookingTime() { return bookingTime; }
    public void setBookingTime(String bookingTime) { this.bookingTime = bookingTime; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPatientNotes() { return patientNotes; }
    public void setPatientNotes(String patientNotes) { this.patientNotes = patientNotes; }
    
    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }
    
    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    
    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
    
    public DoctorSummaryDTO getDoctor() { return doctor; }
    public void setDoctor(DoctorSummaryDTO doctor) { this.doctor = doctor; }
    
    public HospitalDTO getHospital() { return hospital; }
    public void setHospital(HospitalDTO hospital) { this.hospital = hospital; }
}