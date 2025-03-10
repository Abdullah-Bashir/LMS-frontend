import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { lendBook } from '../redux/slices/borrowSlice'; // Adjust the import path
import { closeAllPopups } from '../redux/slices/popupSlice'; // Adjust the import path

const RecordBookPopup = () => {
    const dispatch = useDispatch();
    const { books } = useSelector((state) => state.books); // Fetch books from the bookSlice
    const { error } = useSelector((state) => state.borrow); // Fetch error from the borrowSlice
    const [email, setEmail] = useState('');
    const [selectedBookId, setSelectedBookId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedBookId || !email) {
            alert("Please select a book and enter a valid email.");
            return;
        }

        dispatch(lendBook({ bookId: selectedBookId, email }))
            .unwrap()
            .then(() => {
                dispatch(closeAllPopups()); // Close the popup on success
            })
            .catch((error) => {
                console.error("Failed to lend book:", error);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Lend Book</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select a Book</option>
                        {books.map((book) => (
                            <option key={book._id} value={book._id} className='w-20' >
                                {book.title} by {book.author}
                            </option>
                        ))}
                    </select>
                    <input
                        type="email"
                        placeholder="User Email"
                        className="w-full p-2 border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => dispatch(closeAllPopups())}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Lend Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordBookPopup;