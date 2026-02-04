/**
 * Authentication Service
 *
 * Handles user registration and login.
 * Uses backend API when available, falls back to localStorage for offline/local development.
 * This enables cross-device account sync when backend is configured.
 */

import { platformApi } from '@/sdk/core/request';

const AUTH_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
} as const;

// localStorage key for users (fallback when backend is not available)
const LOCAL_USERS_KEY = 'habitTracker_users';

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
 * Check if backend API is available
 */
function isBackendAvailable(): boolean {
  const apiBasePath = import.meta.env.VITE_MCP_API_BASE_PATH;
  return !!apiBasePath && apiBasePath.length > 0;
}

/**
 * Get stored users from localStorage
 */
function getLocalUsers(): Record<string, { name: string; password: string; isPremium: boolean; createdAt: string }> {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save users to localStorage
 */
function saveLocalUsers(users: Record<string, { name: string; password: string; isPremium: boolean; createdAt: string }>): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

/**
 * Register a new user account
 * Uses backend API when available, falls back to localStorage
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  // Try backend API first if available
  if (isBackendAvailable()) {
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
      // Backend failed, fall through to localStorage
      console.warn('Backend registration failed, using localStorage:', error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getLocalUsers();

    if (users[email]) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    // Save new user
    users[email] = {
      name,
      password: btoa(password), // Simple encoding for demo - not secure for production
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    saveLocalUsers(users);

    return {
      success: true,
      user: {
        id: email,
        email,
        name,
        isPremium: false,
        createdAt: users[email].createdAt,
      },
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
 * Login user
 * Uses backend API when available, falls back to localStorage
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Try backend API first if available
  if (isBackendAvailable()) {
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
      // Backend failed, fall through to localStorage
      console.warn('Backend login failed, using localStorage:', error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getLocalUsers();

    if (!users[email]) {
      return {
        success: false,
        error: 'No account found with this email. Please sign up.',
      };
    }

    // Verify password
    if (users[email].password !== btoa(password)) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    return {
      success: true,
      user: {
        id: email,
        email,
        name: users[email].name,
        isPremium: users[email].isPremium || false,
        createdAt: users[email].createdAt,
      },
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
 * Get current user info
 * Uses backend API when available
 */
export async function getCurrentUser(): Promise<AuthResult> {
  if (!isBackendAvailable()) {
    return {
      success: false,
      error: 'Backend not available',
    };
  }

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
