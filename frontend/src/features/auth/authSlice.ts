import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company: any;
  avatar: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Helper functions for cookie management
const setCookieToken = (name: string, value: string) => {
  Cookies.set(name, value, {
    expires: name === "token" ? 1 : 7, // 1 day for access, 7 days for refresh
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const removeCookieToken = (name: string) => {
  Cookies.remove(name);
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      
      // Store tokens in cookies for middleware access
      setCookieToken("token", data.access);
      setCookieToken("refresh_token", data.refresh);
      
      // Also store in localStorage for backward compatibility
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      
      // Store role for authorization
      if (data.user?.role) {
        localStorage.setItem("user_role", data.user.role);
        Cookies.set("user_role", data.user.role, { expires: 7 });
      }
      
      const user = data.user ?? (await authService.getMe());
      return { ...data, user };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data ?? err.response?.data?.detail ?? "Login failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    return await authService.getMe();
  } catch (err: any) {
    return rejectWithValue("Failed to fetch user");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      
      // Remove from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      
      // Remove from cookies
      removeCookieToken("token");
      removeCookieToken("refresh_token");
      removeCookieToken("user_role");
    },
    setTokens(state, action: PayloadAction<{ access: string; refresh: string }>) {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      
      // Update cookies
      setCookieToken("token", action.payload.access);
      setCookieToken("refresh_token", action.payload.refresh);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, setTokens } = authSlice.actions;
export default authSlice.reducer;
