/**
 * Authentication Service
 *
 * Handles user registration and login.
 * Uses backend ORM (database) for account storage to enable cross-device sync.
 * Falls back to localStorage only when backend is not available.
 */

import { UserAccountsORM, type UserAccountsModel } from '@/sdk/database/orm/orm_user_accounts';

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
 * Get singleton ORM instance for user accounts
 */
function getUserAccountsORM(): UserAccountsORM {
  return UserAccountsORM.getInstance();
}

/**
 * Convert ORM model to AuthUser
 */
function ormModelToAuthUser(model: UserAccountsModel): AuthUser {
  return {
    id: model.id,
    email: model.email,
    name: model.name,
    isPremium: model.is_premium,
    createdAt: model.create_time ? new Date(parseInt(model.create_time) * 1000).toISOString() : new Date().toISOString(),
  };
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
 * Uses backend ORM when available, falls back to localStorage
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  // Try backend ORM first if available
  if (isBackendAvailable()) {
    try {
      const orm = getUserAccountsORM();

      // Check if user already exists
      const existingUsers = await orm.getUserAccountsByEmail(email);
      if (existingUsers.length > 0) {
        return {
          success: false,
          error: 'An account with this email already exists',
        };
      }

      // Create new user account in backend database
      const newUser: UserAccountsModel = {
        id: '', // Backend will assign
        data_creator: '',
        data_updater: '',
        create_time: '',
        update_time: '',
        email,
        name,
        password: btoa(password), // Simple encoding - backend should handle proper hashing
        is_premium: false,
      };

      const insertedUsers = await orm.insertUserAccounts([newUser]);

      if (insertedUsers.length === 0) {
        return {
          success: false,
          error: 'Failed to create account',
        };
      }

      return {
        success: true,
        user: ormModelToAuthUser(insertedUsers[0]),
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
 * Uses backend ORM when available, falls back to localStorage
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Try backend ORM first if available
  if (isBackendAvailable()) {
    try {
      const orm = getUserAccountsORM();

      // Find user by email
      const users = await orm.getUserAccountsByEmail(email);

      if (users.length === 0) {
        return {
          success: false,
          error: 'No account found with this email. Please sign up.',
        };
      }

      const user = users[0];

      // Verify password
      if (user.password !== btoa(password)) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      return {
        success: true,
        user: ormModelToAuthUser(user),
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
 * Get current user info by email
 * Uses backend ORM when available
 */
export async function getCurrentUser(email?: string): Promise<AuthResult> {
  if (!email) {
    return {
      success: false,
      error: 'Email required',
    };
  }

  if (!isBackendAvailable()) {
    // Try localStorage
    const users = getLocalUsers();
    if (users[email]) {
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
    }
    return {
      success: false,
      error: 'User not found',
    };
  }

  try {
    const orm = getUserAccountsORM();
    const users = await orm.getUserAccountsByEmail(email);

    if (users.length === 0) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user: ormModelToAuthUser(users[0]),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Error fetching user: ${message}`,
    };
  }
}
