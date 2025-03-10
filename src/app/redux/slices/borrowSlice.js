import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios to include credentials (cookies) in requests
const axiosInstance = axios.create({
    withCredentials: true,
});

// Async Thunks

/**
 * Lend a book to a user (Admin only)
 */
export const lendBook = createAsyncThunk(
    "borrow/lendBook",
    async ({ bookId, email }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`http://localhost:5000/api/borrow/lend/${bookId}`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Return a borrowed book (Admin only)
 */
export const returnBook = createAsyncThunk(
    "borrow/returnBook",
    async ({ bookId, email }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`http://localhost:5000/api/borrow/return/${bookId}`, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Fetch all borrowed books (Admin only)
 */
export const fetchBorrowedBooks = createAsyncThunk(
    "borrow/fetchBorrowedBooks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("http://localhost:5000/api/borrow/admin/borrowed-books");
            return response.data.borrowedBooks;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

/**
 * Fetch a user's borrowed books
 */
export const fetchMyBorrowedBooks = createAsyncThunk(
    "borrow/fetchMyBorrowedBooks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("http://localhost:5000//api/borrow/my-borrowed-books");
            return response.data.borrowedBooks;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice Definition
const borrowSlice = createSlice({
    name: "borrow",
    initialState: {
        borrowedBooks: [], // All borrowed books (admin view)
        myBorrowedBooks: [], // Logged-in user's borrowed books
        status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Lend Book
            .addCase(lendBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(lendBook.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myBorrowedBooks = action.payload.user.borrowedBooks; // Update user's borrowed books
            })
            .addCase(lendBook.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to lend book";
            })

            // Return Book
            .addCase(returnBook.pending, (state) => {
                state.status = "loading";
            })
            .addCase(returnBook.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myBorrowedBooks = action.payload.user.borrowedBooks; // Update user's borrowed books
            })
            .addCase(returnBook.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to return book";
            })

            // Fetch All Borrowed Books (Admin)
            .addCase(fetchBorrowedBooks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBorrowedBooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.borrowedBooks = action.payload; // Update all borrowed books
            })
            .addCase(fetchBorrowedBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to fetch borrowed books";
            })

            // Fetch My Borrowed Books
            .addCase(fetchMyBorrowedBooks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMyBorrowedBooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myBorrowedBooks = action.payload; // Update logged-in user's borrowed books
            })
            .addCase(fetchMyBorrowedBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Failed to fetch my borrowed books";
            });
    },
});

export default borrowSlice.reducer;