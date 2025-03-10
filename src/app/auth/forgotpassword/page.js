"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/app/redux/slices/authSlice";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            const resultAction = await dispatch(forgotPassword(email));
            if (forgotPassword.fulfilled.match(resultAction)) {
                toast.success("Password reset link sent! Check your email within 10 minutes");
            } else {
                toast.error(resultAction.payload || "Failed to send reset email");
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

            <h2 className="text-xl font-semibold mt-4">Forgot Your Password?</h2>
            <p className="text-gray-600 text-center mt-2 max-w-md">
                Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center w-full max-w-md">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 outline-none rounded-lg"
                />
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 cursor-pointer"
                >
                    Send Reset Link
                </button>
            </form>

            <p className="mt-4 text-gray-600">
                Remember your password?{" "}
                <a href="/auth/login" className="text-orange-500 font-semibold">
                    Log in
                </a>
            </p>
        </div>
    );
};

export default ForgotPassword;