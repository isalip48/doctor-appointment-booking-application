package com.appointment.booking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appointment.booking.dto.admin.BulkDoctorImportRequestDTO;
import com.appointment.booking.dto.admin.DoctorAdminDTO;
import com.appointment.booking.dto.admin.SlotGenerationRequestDTO;
import com.appointment.booking.entity.Booking;
import com.appointment.booking.entity.Slot;
import com.appointment.booking.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    // ============ DOCTOR MANAGEMENT ============
    
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorAdminDTO>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorAdminDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDoctorById(id));
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorAdminDTO> createDoctor(@RequestBody DoctorAdminDTO doctorDTO) {
        return ResponseEntity.ok(adminService.createDoctor(doctorDTO));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorAdminDTO> updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorAdminDTO doctorDTO) {
        return ResponseEntity.ok(adminService.updateDoctor(id, doctorDTO));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/doctors/bulk")
    public ResponseEntity<Map<String, Object>> bulkImportDoctors(
            @RequestBody BulkDoctorImportRequestDTO request) {
        return ResponseEntity.ok(adminService.bulkImportDoctors(request));
    }

    // ============ SLOT MANAGEMENT ============

    @PostMapping("/slots/generate")
    public ResponseEntity<Map<String, Object>> generateSlots(
            @RequestBody SlotGenerationRequestDTO request) {
        return ResponseEntity.ok(adminService.generateSlots(request));
    }

    @GetMapping("/slots")
    public ResponseEntity<List<Slot>> getAllSlots(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(adminService.getSlots(doctorId, date));
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        adminService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }

    // ============ BOOKING MANAGEMENT ============

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getAllBookings(status));
    }

    @GetMapping("/bookings/stats")
    public ResponseEntity<Map<String, Object>> getBookingStats() {
        return ResponseEntity.ok(adminService.getBookingStats());
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        adminService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    // ============ DASHBOARD STATS ============

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
