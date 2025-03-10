"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toggleSettingPopup, closeAllPopups } from "@/app/redux/slices/popupSlice";
import { updatePassword } from "@/app/redux/slices/authSlice"; // Import updatePassword
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingPopup = () => {
    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { isLoading } = useSelector((state) => state.auth); // Get loading state from authSlice

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        // Dispatch updatePassword action
        try {
            const resultAction = await dispatch(
                updatePassword({ oldPassword, newPassword, confirmPassword })
            ).unwrap();
            toast.success(resultAction); // Show success message
            resetForm();
            // dispatch(closeAllPopups());
        } catch (error) {
            setError(error || "Failed to update password");
            toast.error("New password and confirm password do not match or worng old password");
        }
    };

    const resetForm = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    };

    return (
        <div className="fixed inset-0 bg-gray-900/30 flex items-center justify-center z-20 backdrop-blur-sm">
            <ToastContainer position="top-right" autoClose={3000} />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Update Password</h2>
                    <button
                        onClick={() => dispatch(toggleSettingPopup())}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Old Password *
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            New Password *
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 disabled:bg-orange-300"
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default SettingPopup;