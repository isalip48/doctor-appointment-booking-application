package com.appointment.booking.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorImportDTO {
    private String name;
    private String specialization;
    private String hospitalName;
    private String qualifications;
    private Integer experienceYears;
    private Double consultationFee;
}