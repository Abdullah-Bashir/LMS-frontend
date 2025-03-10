import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBook } from '../redux/slices/bookSlice';
import { closeAllPopups } from '../redux/slices/popupSlice';

const AddBookPopup = () => {
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.books);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        quantity: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addBook({
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity)
        }))
            .unwrap()
            .then(() => dispatch(closeAllPopups()))
            .catch((error) => console.error(error));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Add New Book</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        className="w-full p-2 border rounded"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Author"
                        className="w-full p-2 border rounded"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full p-2 border rounded"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        step="0.01"
                        className="w-full p-2 border rounded"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        className="w-full p-2 border rounded"
                        value={formData.quantity}
                        onChange={handleChange}
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
                            Add Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookPopup;