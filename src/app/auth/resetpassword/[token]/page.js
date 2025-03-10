"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/app/redux/slices/authSlice";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useParams();
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = passwords;

        if (!newPassword || !confirmPassword) {
            toast.error("Both password fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const resultAction = await dispatch(resetPassword({
                token,
                data: { newPassword, confirmPassword }
            }));

            if (resetPassword.fulfilled.match(resultAction)) {
                toast.success("Password reset successfully! Redirecting...");
                setTimeout(() => router.push("/auth/login"), 2000);
            } else {
                toast.error(resultAction.payload || "Password reset failed");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <img className="w-28" src="/cool-emoji.gif" alt="" />
            <motion.h1 className="text-4xl font-bold text-orange-500" animate={{ y: [-10, 0] }}>
                Book Mart
            </motion.h1>

            <h2 className="text-xl font-semibold mt-4">Reset Your Password</h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center w-full max-w-md">
                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 outline-none rounded-lg mb-4"
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 outline-none rounded-lg"
                />
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 cursor-pointer"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;