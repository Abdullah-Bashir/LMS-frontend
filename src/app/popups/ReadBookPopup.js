import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAllPopups } from '../redux/slices/popupSlice'; // Adjust the import path

const ReadBookPopup = () => {
    const dispatch = useDispatch();
    const { selectedBook } = useSelector((state) => state.books); // Fetch selectedBook from the bookSlice

    if (!selectedBook) return null; // Don't render if no book is selected

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{selectedBook.title}</h2>
                <div className="space-y-2">
                    <p><span className="font-semibold">Author:</span> {selectedBook.author}</p>
                    <p><span className="font-semibold">Description:</span> {selectedBook.description}</p>
                    <p><span className="font-semibold">Price:</span> ${selectedBook.price}</p>
                    <p><span className="font-semibold">Quantity:</span> {selectedBook.quantity}</p>
                    <p><span className="font-semibold">Availability:</span>
                        {selectedBook.availability ? ' Available' : ' Not Available'}
                    </p>
                </div>
                <button
                    onClick={() => dispatch(closeAllPopups())}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ReadBookPopup;