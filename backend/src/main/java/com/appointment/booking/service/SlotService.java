package com.appointment.booking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.appointment.booking.dto.SlotDTO;
import com.appointment.booking.repository.DoctorRepository;
import com.appointment.booking.repository.SlotRepository;

@Service
public class SlotService {

    private final SlotRepository slotRepository;
    private final DoctorRepository doctorRepository;
    private final MappingService mappingService;

    public SlotService(SlotRepository slotRepository,
            DoctorRepository doctorRepository,
            MappingService mappingService) {
        this.slotRepository = slotRepository;
        this.doctorRepository = doctorRepository;
        this.mappingService = mappingService;
    }

    /**
     * Get all available slots
     */
    public List<SlotDTO> getAllAvailableSlots() {
        return slotRepository.findAll()
                .stream()
                .filter(slot -> slot.getIsAvailable())
                .map(mappingService::toSlotDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search slots by doctor name and date
     */
    public List<SlotDTO> searchByDoctorName(String doctorName, LocalDate date) {
        return slotRepository.searchByDoctorNameAndDate(doctorName, date)
                .stream()
                .map(mappingService::toSlotDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search slots by specialization and date
     */
    public List<SlotDTO> searchBySpecialization(String specialization, LocalDate date) {
        return slotRepository.searchBySpecializationAndDate(specialization, date)
                .stream()
                .map(mappingService::toSlotDTO)
                .collect(Collectors.toList());
    }
}