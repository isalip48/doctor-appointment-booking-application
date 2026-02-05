import { useQuery } from '@tanstack/react-query';
import { searchSlots, getSlotsByDoctor } from '@/api/slots.api';
import { SlotSearchRequest } from '@/api/types';

/**
 * React Query Hooks for Slots
 */

/**
 * Search slots with filters
 * 
 * USAGE:
 * const { data: slots, isLoading } = useSlotSearch({
 *   hospitalId: 1,
 *   specialization: 'Cardiology',
 *   date: '2024-02-10'
 * });
 * 
 * WHY ENABLED CHECK:
 * Don't search until we have at least a date
 */
export const useSlotSearch = (searchRequest: SlotSearchRequest) => {
  return useQuery({
    queryKey: ['slots', 'search', searchRequest],
    queryFn: () => searchSlots(searchRequest),
    enabled: !!searchRequest.date, // Only search if date is provided
    staleTime: 1 * 60 * 1000, // 1 minute (slots change frequently as they get booked)
  });
};

/**
 * Get slots for a specific doctor
 * 
 * USAGE:
 * const { data: doctorSlots } = useDoctorSlots(doctorId);
 */
export const useDoctorSlots = (doctorId: number) => {
  return useQuery({
    queryKey: ['slots', 'doctor', doctorId],
    queryFn: () => getSlotsByDoctor(doctorId),
    enabled: !!doctorId,
    staleTime: 1 * 60 * 1000,
  });
};