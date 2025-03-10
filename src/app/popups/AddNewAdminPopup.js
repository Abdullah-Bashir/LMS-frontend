"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { registerAdmin } from "@/app/redux/slices/userSlice";
import { toggleAddNewAdminPopup, closeAllPopups } from "@/app/redux/slices/popupSlice";

const AddNewAdminPopup = () => {
    const dispatch = useDispatch();
    const { status, error: apiError } = useSelector((state) => state.user);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState("");

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please upload an image file");
                return;
            }
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email || !password) {
            setError("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        if (avatar) formData.append("avatar", avatar);

        try {
            await dispatch(registerAdmin(formData)).unwrap();
            dispatch(closeAllPopups());
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to create admin");
        }
    };

    const resetForm = () => {
        setUsername("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setAvatarPreview(null);
        setError("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-20">
            {/* Dark overlay background */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Form Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add New Admin</h2>
                    <button
                        onClick={() => dispatch(toggleAddNewAdminPopup())}
                        className="text-gray-700 hover:text-gray-700 bg-orange-400 p-2 rounded-lg cursor-pointer font-extrabold"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div>
                        <label className="block text-sm font-medium focus:border-2 focus:ring-amber-500 mb-1">Username *</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium focus:border-2 focus:border-orange-400 mb-1">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium focus:border-2 focus:border-orange-400 mb-1">Password *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Avatar</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-500 disabled:bg-orange-300"
                    >
                        {status === "loading" ? "Creating..." : "Create Admin"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddNewAdminPopup;
