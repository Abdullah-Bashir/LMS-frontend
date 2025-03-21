import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios to include credentials (cookies) in requests
const axiosInstance = axios.create({
    withCredentials: true,
});

// Async Thunks

// Fetch all books
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
    const response = await axiosInstance.get("http://localhost:5000/api/book/all");
    return response.data;
});

// Add a new book
export const addBook = createAsyncThunk("books/addBook", async (bookData) => {
    const response = await axiosInstance.post("http://localhost:5000/api/book/", bookData);
    return response.data.book;
});

// Delete a book by ID
export const deleteBook = createAsyncThunk("books/deleteBook", async (bookId) => {
    await axiosInstance.delete(`http://localhost:5000/api/book/${bookId}`);
    return bookId;
});

// Slice Definition
const bookSlice = createSlice({
    name: "books",
    initialState: {
        books: [],
        selectedBook: null, // To store the currently selected book for viewing
        status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Reducer to set the selected book
        setSelectedBook: (state, action) => {
            state.selectedBook = action.payload;
        },
        // Reducer to clear the selected book
        clearSelectedBook: (state) => {
            state.selectedBook = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Books
            .addCase(fetchBooks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Add Book
            .addCase(addBook.fulfilled, (state, action) => {
                state.books.push(action.payload);
            })

            // Delete Book
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.books = state.books.filter((book) => book._id !== action.payload);
            });
    },
});

// Export actions
export const { setSelectedBook, clearSelectedBook } = bookSlice.actions;

export default bookSlice.reducer;