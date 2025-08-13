// ============================================================================
// CORE USER INTERFACES
// ============================================================================

// Main User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// User Data interface (for creating users)
export interface UserData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

// Update User Data interface
export interface UpdateUserData {
  id: string;
  name?: string; // ✅ Added name field (was missing but used in updateUser)
  role: string;
}

// Admin Redux State interface
export interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

// Add User Response interface
export interface AddUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

// Update User Response interface
export interface UpdateUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

// Delete User Response interface
export interface DeleteUserResponse {
  success: boolean;
  message?: string;
}
