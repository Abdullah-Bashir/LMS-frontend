import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for registering an admin
export const registerAdmin = createAsyncThunk(
    'user/registerAdmin',
    async (formData, { rejectWithValue }) => { // Rename adminData to formData
        try {
            // Remove the manual FormData creation and use the received formData directly
            const response = await axios.post('http://localhost:5000/api/users/admin/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
    'user/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/all', {
                withCredentials: true, // Include credentials
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        admin: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        // You can add other synchronous reducers here if needed
    },
    extraReducers: (builder) => {
        builder
            // Register Admin
            .addCase(registerAdmin.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.admin = action.payload.admin;
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })

            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    },
});

export default userSlice.reducer;