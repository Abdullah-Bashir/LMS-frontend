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
        if (error) toast.error(error);
    }, [error]);

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAdmin = user?.role === "admin";

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h1 className="text-xl font-semibold text-gray-800">
                    {isAdmin ? "Book Management" : "Books"}
                </h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full"
                    />
                    {isAdmin && (
                        <button
                            onClick={() => dispatch(toggleAddBookPopup())}
                            className="px-4 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm whitespace-nowrap"
                        >
                            Add Book
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Title</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Author</th>
                            {isAdmin && <th className="px-4 py-2 text-left font-medium text-gray-600">Qty</th>}
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks.map((book, index) => (
                            <motion.tr
                                key={book._id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 font-medium">{book.title}</td>
                                <td className="px-4 py-2 text-gray-600">{book.author}</td>
                                {isAdmin && <td className="px-4 py-2 text-gray-600">{book.quantity}</td>}
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full ${book.availability
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {book.availability ? "Available" : "Borrowed"}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => {
                                            dispatch(toggleReadBookPopup());
                                            dispatch(setSelectedBook(book));
                                        }}
                                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                                    >
                                        View
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                dispatch(toggleRecordBookPopup());
                                                dispatch(setSelectedBook(book));
                                            }}
                                            className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
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
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}

            {status === "succeeded" && filteredBooks.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                    No books found matching your search
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            {addbookpopup && <AddBookPopup />}
            {readbookpopup && <ReadBookPopup />}
            {recordbookpopup && <RecordBookPopup />}
        </div>
    );
};

export default BookManagement;