// redux/adminSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

// ✅ Import all types from unified file
import api from "../api/api";
import type {
  AddUserResponse,
  AdminState,
  DeleteUserResponse,
  UpdateUserData,
  User,
  UserData,
} from "../types/user";

// Thunks
// Fetch all users from db for admin
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<User[]>(
      `/api/admin/users`,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to fetch users";
    return rejectWithValue(String(message));
  }
});

// Add a new user by admin
export const addUser = createAsyncThunk<
  User,
  UserData,
  { rejectValue: string }
>("admin/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<AddUserResponse>(
      `/api/admin/users`,
      userData,
     
    );
    // Handle both possible response formats
    return response.data.user || (response.data as any);
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to add user";
    return rejectWithValue(String(message));
  }
});

// Update a user by admin
export const updateUser = createAsyncThunk<
  User,
  UpdateUserData,
  { rejectValue: string }
>("admin/updateUser", async ({ id, name, role }, { rejectWithValue }) => {
  try {
    // ✅ Fixed: now properly destructures name and role
    const updateData: Partial<UserData> = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    const response = await api.put<User>(
      `$/api/admin/users/${id}`,
      updateData,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to update user";
    return rejectWithValue(String(message));
  }
});

// Delete a user by admin
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await api.delete<DeleteUserResponse>(
      `/api/admin/users/${id}`,
      { withCredentials: true }
    );
    return id;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to delete user";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
};

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // ✅ Added utility reducers for better state management
    clearUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users";
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add user";
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update user";
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete user";
      });
  },
});

export const { clearUsers, clearError } = adminSlice.actions;
export default adminSlice.reducer;
