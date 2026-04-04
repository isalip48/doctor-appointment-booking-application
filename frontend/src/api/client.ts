import axios from 'axios';
/**
 * Axios Instance
 * 
 * WHY: Centralized HTTP client with base configuration
 * BENEFIT: Don't repeat URL and headers in every API call
 */
const getBaseURL = () => {
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';
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
  timeout: 10000,
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