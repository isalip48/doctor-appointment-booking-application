package com.appointment.booking.controller;

import com.appointment.booking.dto.HospitalDTO;
import com.appointment.booking.service.HospitalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Hospital Controller
 * 
 * BASE URL: /api/hospitals
 * 
 * ANNOTATIONS EXPLAINED:
 * @RestController: Tells Spring this class handles REST API requests
 * @RequestMapping: Base path for all endpoints in this controller
 * @CrossOrigin: Allows requests from React Native app (different origin)
 * 
 * WHY ResponseEntity: 
 * - Gives control over HTTP status codes
 * - Can return different statuses (200 OK, 404 Not Found, etc.)
 */
@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")  // Allow all origins (for development)
public class HospitalController {
    
    private final HospitalService hospitalService;
    
    /**
     * CONSTRUCTOR INJECTION
     * Spring automatically provides HospitalService instance
     */
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }
    
    /**
     * GET /api/hospitals
     * Get all hospitals
     * 
     * @GetMapping: Handles HTTP GET requests
     * ResponseEntity.ok(): Returns HTTP 200 with data
     * 
     * FRONTEND CALL:
     * fetch('http://localhost:8080/api/hospitals')
     * 
     * RESPONSE:
     * [
     *   { "id": 1, "name": "Apollo Hospital", "city": "Colombo" },
     *   { "id": 2, "name": "Asiri Hospital", "city": "Kandy" }
     * ]
     */
    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        List<HospitalDTO> hospitals = hospitalService.getAllHospitals();
        return ResponseEntity.ok(hospitals);
    }
    
    /**
     * GET /api/hospitals/{id}
     * Get hospital by ID
     * 
     * @PathVariable: Extracts {id} from URL
     * EXAMPLE: GET /api/hospitals/5 -> id = 5
     * 
     * TRY-CATCH: Handle errors gracefully
     * - Success: Return 200 OK with hospital data
     * - Not found: Return 404 NOT FOUND with error message
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getHospitalById(@PathVariable Long id) {
        try {
            HospitalDTO hospital = hospitalService.getHospitalById(id);
            return ResponseEntity.ok(hospital);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }
    
    /**
     * GET /api/hospitals/city/{city}
     * Get hospitals by city
     * 
     * EXAMPLE: GET /api/hospitals/city/Colombo
     * Returns all hospitals in Colombo
     */
    @GetMapping("/city/{city}")
    public ResponseEntity<List<HospitalDTO>> getHospitalsByCity(@PathVariable String city) {
        List<HospitalDTO> hospitals = hospitalService.getHospitalsByCity(city);
        return ResponseEntity.ok(hospitals);
    }
    
    /**
     * GET /api/hospitals/search?name=Apollo
     * Search hospitals by name
     * 
     * @RequestParam: Extracts query parameter from URL
     * EXAMPLE: /api/hospitals/search?name=Apollo -> name = "Apollo"
     * 
     * WHY Query Param vs Path Variable:
     * - Path Variable: Required, identifies a resource (/hospitals/{id})
     * - Query Param: Optional, for filtering/searching (?name=Apollo&city=Colombo)
     */
    @GetMapping("/search")
    public ResponseEntity<List<HospitalDTO>> searchHospitals(
            @RequestParam String name) {
        List<HospitalDTO> hospitals = hospitalService.searchHospitalsByName(name);
        return ResponseEntity.ok(hospitals);
    }
    
    /**
     * POST /api/hospitals
     * Create new hospital (Admin only - auth to be added later)
     * 
     * @PostMapping: Handles HTTP POST requests
     * @RequestBody: Converts JSON from request body to HospitalDTO
     * 
     * FRONTEND CALL:
     * fetch('http://localhost:8080/api/hospitals', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     name: "New Hospital",
     *     address: "123 Main St",
     *     city: "Colombo"
     *   })
     * })
     * 
     * RETURNS: HTTP 201 CREATED with new hospital data
     */
    @PostMapping
    public ResponseEntity<HospitalDTO> createHospital(@RequestBody HospitalDTO hospitalDTO) {
        HospitalDTO created = hospitalService.createHospital(hospitalDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}