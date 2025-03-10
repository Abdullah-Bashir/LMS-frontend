import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popupSlice";
import userReducer from "./slices/userSlice";
import bookReducer from "./slices/bookSlice"
import borrowReducer from "./slices/borrowSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        popup: popupReducer,
        user: userReducer,
        books: bookReducer,
        borrow: borrowReducer,
    },
    // devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

export default store;
