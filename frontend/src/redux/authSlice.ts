import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../api/api";

// Types
export interface User {
  _id: string;
  name: string;
    email: string;
    role: string;
  // add any other fields you store
}



export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// LocalStorage keys
const USER_INFO_KEY = "userInfo";

// Helpers
const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};


// Initial state
const initialState: AuthState = {
  user: getStoredUser(),
  loading: false,
  error: null,
};



// Thunks
export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>
  ("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const res = await api.post<User>(`/api/users/login`,userData,
   
    );
    return res.data;
  } catch (err) {
    // More specific error handling
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      return rejectWithValue(message);
    }

    // Handle non-axios errors
    return rejectWithValue("An unexpected error occurred");
  }
});

export const registerUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const res = await api.post(
      `/api/users/register`,
        userData,
      {withCredentials:true}
    );
    return res.data;
  } catch (err) {
    // More specific error handling
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed";
      return rejectWithValue(message);
    }

    // Handle non-axios errors
    return rejectWithValue("An unexpected error occurred");
  }
});

// Thunks
export const logoutUser = createAsyncThunk<User,void,{ rejectValue: string }>
  ("auth/logoutUser", async ( _ ,{ rejectWithValue }) => {
    try {
    
    const res = await api.post(`/api/users/logout`,
    );
    return res.data;
  } catch (err) {
    // More specific error handling
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Logout failed";
      return rejectWithValue(message);
    }

    // Handle non-axios errors
    return rejectWithValue("An unexpected error occurred");
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState, // fixed: use initialState here (not inside reducers)
  reducers: {
   
   
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(action.payload));

        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })

    // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; 
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(action.payload));

        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed"; 
      })
  

   // logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null; 
        localStorage.removeItem(USER_INFO_KEY);
        localStorage.removeItem("cart");
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "logout failed";
      });
  },
});


export default authSlice.reducer;
