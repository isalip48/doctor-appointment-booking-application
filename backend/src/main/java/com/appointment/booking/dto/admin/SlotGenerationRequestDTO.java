package com.appointment.booking.dto.admin;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class SlotGenerationRequestDTO {
    private Long doctorId;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime consultationStartTime; // e.g., 09:00
    private Integer maxBookingsPerDay;      // Default: 30
    private Integer minutesPerPatient;      // Default: 10
}