package com.appointment.booking.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorAdminDTO {
    private Long id;
    private String name;
    private String specialization;
    private String qualifications;
    private Integer experienceYears;
    private Double consultationFee;
    private Long hospitalId;
    private String hospitalName;
}