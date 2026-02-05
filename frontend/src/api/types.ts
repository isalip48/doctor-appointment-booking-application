/**
 * TypeScript Types
 * 
 * WHY: Match backend DTOs exactly for type safety
 * BENEFIT: Autocomplete, compile-time error checking
 */

// Hospital Types
export interface Hospital {
  id: number;
  name: string;
  address: string;
  city: string;
  phoneNumber?: string;
}

// Doctor Types
export interface DoctorSummary {
  id: number;
  name: string;
  specialization: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
  hospital: Hospital;
}

// Slot Types
export interface Slot {
  id: number;
  slotDate: string;          // "2024-02-05"
  startTime: string;         // "09:00"
  endTime: string;           // "09:30"
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  isAvailable: boolean;
  doctor: DoctorSummary;
  hospital: Hospital;
}

// Booking Types
export interface Booking {
  id: number;
  bookingTime: string;       // "2024-02-04 15:30:00"
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  patientNotes?: string;
  amountPaid?: number;
  appointmentDate: string;   // "2024-02-10"
  appointmentTime: string;   // "09:00"
  doctor: DoctorSummary;
  hospital: Hospital;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

// Request Types
export interface SlotSearchRequest {
  hospitalId?: number;
  doctorId?: number;
  specialization?: string;
  date: string;              // Required: "2024-02-05"
}

export interface BookingRequest {
  slotId: number;
  userId: number;
  patientNotes?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}