/**
 * Authentication Service
 *
 * Handles user registration and login via backend API.
 * This enables cross-device account sync - accounts created on mobile
 * will be accessible on desktop and vice versa.
 */

import { platformApi } from '@/sdk/core/request';

const AUTH_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
} as const;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

/**
 * Register a new user account via backend API
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  try {
    const response = await platformApi.post(AUTH_ENDPOINTS.REGISTER, {
      email,
      password,
      name,
    });

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || errorData.error || `Registration failed: ${response.status}`,
        };
      } catch {
        return {
          success: false,
          error: `Registration failed: ${response.status}`,
        };
      }
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Registration error: ${message}`,
    };
  }
}

/**
 * Login user via backend API
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const response = await platformApi.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || errorData.error || 'Invalid email or password',
        };
      } catch {
        if (response.status === 401) {
          return { success: false, error: 'Invalid email or password' };
        }
        if (response.status === 404) {
          return { success: false, error: 'No account found with this email. Please sign up.' };
        }
        return {
          success: false,
          error: `Login failed: ${response.status}`,
        };
      }
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Login error: ${message}`,
    };
  }
}

/**
 * Get current user info from backend
 */
export async function getCurrentUser(): Promise<AuthResult> {
  try {
    const response = await platformApi.get(AUTH_ENDPOINTS.ME);

    if (!response.ok) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const data = await response.json();
    return {
      success: true,
      user: data.user || data,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Error fetching user: ${message}`,
    };
  }
}
