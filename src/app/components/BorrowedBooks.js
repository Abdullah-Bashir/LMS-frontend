import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchBorrowedBooks,
    fetchMyBorrowedBooks,
    returnBook
} from '../redux/slices/borrowSlice';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

function BorrowedBooks() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { borrowedBooks, myBorrowedBooks, status, error } = useSelector(
        (state) => state.borrow
    );
    const [showReturned, setShowReturned] = useState(false);
    const [returningBookId, setReturningBookId] = useState(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchBorrowedBooks());
        } else {
            dispatch(fetchMyBorrowedBooks());
        }
    }, [dispatch, isAdmin]);

    const handleReturn = async (bookId, userEmail) => {
        setReturningBookId(bookId);
        try {
            await dispatch(returnBook({ bookId, email: userEmail })).unwrap();
            if (isAdmin) dispatch(fetchBorrowedBooks());
        } catch (error) {
            console.error('Return failed:', error);
        } finally {
            setReturningBookId(null);
        }
    };

    const booksToDisplay = isAdmin ? borrowedBooks : myBorrowedBooks;
    const filteredBooks = booksToDisplay.filter(book =>
        showReturned ? book.returned : !book.returned
    );

    if (status === 'loading') return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h1 className="text-xl font-semibold">
                    {isAdmin ? 'All Borrowed Books' : 'My Borrowed Books'}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowReturned(false)}
                        className={`px-3 py-1.5 text-sm rounded ${!showReturned
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Borrowed
                    </button>
                    <button
                        onClick={() => setShowReturned(true)}
                        className={`px-3 py-1.5 text-sm rounded ${showReturned
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        Returned
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Title</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Author</th>
                            {isAdmin && <th className="px-4 py-2 text-left font-medium text-gray-600">User</th>}
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Borrowed</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Due</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                            {isAdmin && !showReturned && <th className="px-4 py-2 text-left font-medium text-gray-600">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? (showReturned ? 6 : 7) : 5}
                                    className="px-4 py-3 text-center text-gray-500">
                                    No {showReturned ? 'returned' : 'borrowed'} books found
                                </td>
                            </tr>
                        ) : (
                            filteredBooks.map((book) => (
                                <tr key={book._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 font-medium">{book.bookId?.title}</td>
                                    <td className="px-4 py-2 text-gray-600">{book.bookId?.author}</td>
                                    {isAdmin && <td className="px-4 py-2 text-gray-600">{book.userId?.username || '-'}</td>}
                                    <td className="px-4 py-2 text-gray-600">{formatDate(book.borrowedDate)}</td>
                                    <td className="px-4 py-2 text-gray-600">{formatDate(book.dueDate)}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full ${book.returned
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'}`}>
                                            {book.returned ? 'Returned' : 'Borrowed'}
                                        </span>
                                    </td>
                                    {isAdmin && !showReturned && (
                                        <td className="px-4 py-2">
                                            {!book.returned && (
                                                <button
                                                    onClick={() => handleReturn(book.bookId._id, book.userId?.email)}
                                                    disabled={returningBookId === book._id}
                                                    className={`px-2 py-1 text-xs rounded ${returningBookId === book._id
                                                        ? 'bg-gray-200 cursor-not-allowed'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                                >
                                                    {returningBookId === book._id ? 'Processing...' : 'Return'}
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BorrowedBooks;