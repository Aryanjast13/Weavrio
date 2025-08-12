import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

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
  guestId: string;
  loading: boolean;
  error: string | null;
}

// LocalStorage keys
const USER_INFO_KEY = "userInfo";
const GUEST_ID_KEY = "guestId";

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

// Guest id
const initialGuestId = localStorage.getItem(GUEST_ID_KEY) || `guest_${new Date().getTime()}`;
localStorage.setItem(GUEST_ID_KEY, initialGuestId);

// Initial state
const initialState: AuthState = {
  user: getStoredUser(),
  guestId: initialGuestId,
  loading: false,
  error: null,
};



// Thunks
export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>
  ("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post<User>(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,userData,
      { withCredentials: true }
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
    const res = await axios.post<User>(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
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

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState, // fixed: use initialState here (not inside reducers)
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem(USER_INFO_KEY);
      localStorage.setItem(GUEST_ID_KEY, state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem(GUEST_ID_KEY, state.guestId);
    },
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
        console.log(action.payload);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(action.payload));
        localStorage.setItem("Sfsdf", "Sfsfsdfds");

        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed"; // fixed: set error
      });

    // register
    builder
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
        state.error = action.payload ?? "Registration failed"; // fixed
      });
  },
});

export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
