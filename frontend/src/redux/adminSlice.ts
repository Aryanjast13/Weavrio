import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  // add other user fields as per your API
}

export interface UserData {
  name: string;
  email: string;
  role: string;
  password?: string;
  // add other fields needed for user creation
}

export interface UpdateUserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminState {
  users: User[];
  loading: boolean;
  error: string | null;
}

// Thunks
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to fetch users";
    return rejectWithValue(String(message));
  }
});

export const addUser = createAsyncThunk<
  User,
  UserData,
  { rejectValue: string }
>("admin/addUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post<{ user: User }>(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
      userData
    );
    return response.data.user || response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to add user";
    return rejectWithValue(String(message));
  }
});

export const updateUser = createAsyncThunk<
  User,
  UpdateUserData,
  { rejectValue: string }
>(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put<User>(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role }
      );
      return response.data.user;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";
      return rejectWithValue(String(message));
    }
  }
);

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload; // Fixed: was setting to action.payload in rejected case
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch users";
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.loading = true; // Fixed: was false
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false; // Fixed: was true
        state.users.push(action.payload); // Fixed: removed .user since we return user directly
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
        const updatedUser = action.payload; // Fixed variable name
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

export default adminSlice.reducer;
