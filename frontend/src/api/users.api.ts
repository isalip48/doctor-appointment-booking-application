import { apiClient } from './client';
import { User, CreateUserRequest } from './types';

/**
 * User API Functions
 */

/**
 * Create new user (registration)
 * 
 * ENDPOINT: POST /api/users
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post<User>('/users', userData);
  return response.data;
};

/**
 * Get user by ID
 * 
 * ENDPOINT: GET /api/users/{id}
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};

/**
 * Get user by email (for login)
 * 
 * ENDPOINT: GET /api/users/email/{email}
 */
export const getUserByEmail = async (email: string): Promise<User> => {
  const response = await apiClient.get<User>(`/users/email/${email}`);
  return response.data;
};

/**
 * Get all users (admin only)
 * 
 * ENDPOINT: GET /api/users
 */
export const getAllUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};