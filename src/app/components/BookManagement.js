"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, setSelectedBook } from "../redux/slices/bookSlice";
import {
    toggleAddBookPopup,
    toggleReadBookPopup,
    toggleRecordBookPopup
} from "../redux/slices/popupSlice";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookManagement = () => {
    const dispatch = useDispatch();
    const { books, status, error } = useSelector((state) => state.books);
    const { user } = useSelector((state) => state.auth);
    const { addbookpopup, readbookpopup, recordbookpopup } = useSelector((state) => state.popup);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAdmin = user?.role === "admin";

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 font-mono">
                {isAdmin ? "Book Management" : "Books"}
            </h1>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {isAdmin && (
                    <button
                        onClick={() => dispatch(toggleAddBookPopup())}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Add Book
                    </button>
                )}
            </div>

            <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            {isAdmin && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredBooks.map((book, index) => (
                            <motion.tr
                                key={book._id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-4 py-4 text-sm text-gray-900">{book.title}</td>
                                <td className="px-4 py-4 text-sm text-gray-900">{book.author}</td>
                                {isAdmin && (
                                    <td className="px-4 py-4 text-sm text-gray-900">{book.quantity}</td>
                                )}
                                <td className="px-4 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${book.availability
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {book.availability ? "Available" : "Borrowed"}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center flex justify-center space-x-2">
                                    <button
                                        onClick={() => {
                                            dispatch(toggleReadBookPopup());
                                            dispatch(setSelectedBook(book));
                                        }}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                    >
                                        View
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                dispatch(toggleRecordBookPopup());
                                                dispatch(setSelectedBook(book));
                                            }}
                                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                        >
                                            Lend
                                        </button>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {status === "loading" && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}

            {status === "succeeded" && filteredBooks.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No books found matching your search
                </div>
            )}

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Conditionally Render Popups */}
            {addbookpopup && <AddBookPopup />}
            {readbookpopup && <ReadBookPopup />}
            {recordbookpopup && <RecordBookPopup />}
        </div>
    );
};

export default BookManagement;
