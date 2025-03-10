"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { verifyOtp } from "@/app/redux/slices/authSlice";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtp = () => {
    const { email } = useParams();

    const decodedEmail = decodeURIComponent(email);
    const dispatch = useDispatch();

    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        // Ensure only numbers and one character per input
        if (!isNaN(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // If a digit is entered and it's not the last input, move focus to the next input
            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length === 6) {
            const resultAction = await dispatch(
                verifyOtp({ email: decodedEmail, verificationCode: otpCode })
            );
            if (verifyOtp.fulfilled.match(resultAction)) {
                toast.success("OTP verified successfully!");
                // Redirect to login page after a short delay
                setTimeout(() => {
                    router.push("/");
                }, 2000);

            } else {
                toast.error(resultAction.payload || "OTP verification failed");
            }
        } else {
            toast.error("Please enter a valid 6-digit OTP");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <ToastContainer position="top-right" autoClose={3000} />

            <img className="w-28" src="/cool-emoji.gif" alt="" />
            <motion.h1 className="text-4xl font-bold text-orange-500" animate={{ y: [-10, 0] }}>
                Book Mart
            </motion.h1>

            <h2 className="text-xl font-semibold mt-4">See Your Mailbox</h2>
            <p className="text-gray-600 text-center mt-2 max-w-md">
                We have sent a 6-digit OTP to your email{" "}
                <span className="font-semibold">{decodedEmail}</span>. Please enter it below to verify your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
                <div className="flex space-x-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="w-12 h-12 text-center text-xl border-2 border-gray-300 focus:border-orange-500 outline-none rounded-lg"
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 cursor-pointer"
                >
                    Verify OTP
                </button>
            </form>

            <p className="mt-4 text-gray-600">
                New to platform?{" "}
                <a href="/auth/signup" className="text-orange-500 font-semibold">
                    Sign up
                </a>
            </p>
        </div>
    );
};

export default VerifyOtp;
