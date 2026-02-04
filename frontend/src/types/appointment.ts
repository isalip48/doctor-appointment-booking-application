export interface Hospital {
  id: number;
  name: string;
  city: string;
  address?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
  hospital?: Hospital; // A doctor belongs to a hospital
}

export interface Slot {
  id: number;
  date: string; // "2024-02-10"
  time: string; // "09:00"
  isBooked: boolean;
  doctor: Doctor;
}

export interface Booking {
  id: number;
  bookingTime: string; // When the booking was actually made
  status: 'CONFIRMED' | 'CANCELLED';
  appointmentDate: string;
  appointmentTime: string;
  doctor: Partial<Doctor>; // Often simplified in booking responses
  hospital: Partial<Hospital>;
  patientNotes?: string;
}

// Request interface for the search POST request
export interface SlotSearchRequest {
  hospitalId?: number;
  specialization?: string;
  date: string;
}