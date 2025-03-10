import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:5000/api/auth";


export const updatePassword = createAsyncThunk(
    "auth/updatePassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put("http://localhost:5000/api/auth/update-password", data, { withCredentials: true });
            return response.data; // Success message
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update password");
        }
    }
);

export const validateToken = createAsyncThunk(
    "auth/validateToken",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/validate-token`, {
                withCredentials: true,
            });
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Invalid token");
        }
    }
);

// Forgot Password - Sends email with reset code
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email }, { withCredentials: true });
            return response.data;  // Success message
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to send reset email");
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, data }, { rejectWithValue }) => { // Change 'code' to 'token'
        try {
            const response = await axios.put( // Change from POST to PUT
                `http://localhost:5000/api/auth/reset-password/${token}`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to reset password");
        }
    }
);

// 1️⃣ Register User
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
});

// 2️⃣ Verify OTP
export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (otpData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/verify`, otpData, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
});

// 3️⃣ Login User
// authSlice.js - Update loginUser
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            // 1. First login to get cookie
            await axios.post(`${API_URL}/login`, credentials, {
                withCredentials: true,
            });

            // 2. Then validate token to get user data
            const userData = await dispatch(validateToken()).unwrap();
            return userData;
        } catch (error) {
            return rejectWithValue(error.message || "Login failed");
        }
    }
);

// 4️⃣ Logout User
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
});

// To get user profile by token
export const getUser = createAsyncThunk("auth/getUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/users/profile`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
});



const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        successMessage: null,  // For success messages (e.g., email sent)
    },

    reducers: {
        resetAuth: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isAuthenticated = false;
            state.error = null;
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Login User
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Logout User
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.successMessage = "Logged out successfully";
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Get User Profile
            .addCase(getUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload; // Message like "Reset link sent"
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })


            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload; // Message like "Password reset successfully"
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Validate Token
            .addCase(validateToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(validateToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(validateToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })

            // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload; // Message like "Password updated successfully"
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;



