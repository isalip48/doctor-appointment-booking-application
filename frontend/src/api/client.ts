import axios from 'axios';

/**
 * Axios Instance
 * 
 * WHY: Centralized HTTP client with base configuration
 * BENEFIT: Don't repeat URL and headers in every API call
 */

// CHANGE THIS BASED ON YOUR SETUP
const getBaseURL = () => {
  // For Android Emulator: use 10.0.2.2
  // For iOS Simulator: use localhost
  // For Physical Device: use your computer's IP (e.g., 192.168.1.100)
  
  // Uncomment the one you need:
  return 'http://192.168.1.10:8080/api';  // Physical Device
};

/**
 * API Client
 * 
 * Configured with:
 * - Base URL pointing to Spring Boot backend
 * - JSON content type headers
 * - 10 second timeout
 */
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request Interceptor
 * 
 * WHY: Log all outgoing requests (helpful for debugging)
 * Can add authentication tokens here later
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * WHY: Handle errors globally
 * Can add token refresh logic here later
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);