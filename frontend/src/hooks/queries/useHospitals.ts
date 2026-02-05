import { useQuery } from '@tanstack/react-query';
import { getAllHospitals, getHospitalsByCity, searchHospitals } from '@/api/hospitals.api';

/**
 * React Query Hooks for Hospitals
 * 
 * WHY REACT QUERY:
 * - Automatic caching (don't re-fetch same data)
 * - Loading/error states handled automatically
 * - Automatic refetching on focus/reconnect
 * - No more useState/useEffect spaghetti
 * 
 * QUERY KEYS:
 * - Used for caching and invalidation
 * - Format: ['domain', 'action', ...params]
 */

/**
 * Get all hospitals
 * 
 * USAGE:
 * const { data: hospitals, isLoading, error } = useHospitals();
 */
export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals', 'all'],
    queryFn: getAllHospitals,
    // Cache for 5 minutes (hospitals don't change often)
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get hospitals by city
 * 
 * USAGE:
 * const { data } = useHospitalsByCity('Colombo');
 */
export const useHospitalsByCity = (city: string) => {
  return useQuery({
    queryKey: ['hospitals', 'city', city],
    queryFn: () => getHospitalsByCity(city),
    enabled: !!city, // Only run if city is provided
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Search hospitals by name
 * 
 * USAGE:
 * const { data } = useSearchHospitals('Apollo');
 */
export const useSearchHospitals = (searchTerm: string) => {
  return useQuery({
    queryKey: ['hospitals', 'search', searchTerm],
    queryFn: () => searchHospitals(searchTerm),
    enabled: searchTerm.length >= 2, // Only search if 2+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes (search results can be fresher)
  });
};