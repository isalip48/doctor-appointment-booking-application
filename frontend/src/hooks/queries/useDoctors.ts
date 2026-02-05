import { useQuery } from '@tanstack/react-query';
import { getDoctors, getDoctorById, getSpecializations } from '@/api/doctors.api';

/**
 * React Query Hooks for Doctors
 */

/**
 * Get doctors with optional filters
 * 
 * USAGE:
 * const { data: doctors } = useDoctors({ hospitalId: 1 });
 * const { data: cardiologists } = useDoctors({ specialization: 'Cardiology' });
 */
export const useDoctors = (filters?: {
  hospitalId?: number;
  specialization?: string;
}) => {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => getDoctors(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get doctor by ID
 * 
 * USAGE:
 * const { data: doctor } = useDoctor(doctorId);
 */
export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: ['doctors', 'detail', id],
    queryFn: () => getDoctorById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes (doctor details rarely change)
  });
};

/**
 * Get all specializations for filter dropdown
 * 
 * USAGE:
 * const { data: specializations } = useSpecializations();
 */
export const useSpecializations = () => {
  return useQuery({
    queryKey: ['doctors', 'specializations'],
    queryFn: getSpecializations,
    staleTime: 60 * 60 * 1000, // 1 hour (very stable data)
  });
};