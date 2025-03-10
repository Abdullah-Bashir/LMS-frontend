"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/redux/slices/authSlice";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ email: "", password: "" });

    // Images for slider
    const images = ["/book.png", "/blue-book.png", "/bible.png"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser(formData));
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success("Login successful!");
            router.push("/"); // Redirect to home page after successful login
        } else {
            toast.error(error || "Login failed. Please try again.");
        }
    };

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    return (
        <div className="min-h-screen flex">
            {/* Toast Container for Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Left Side: Login Form */}
            <div className="flex flex-col w-full md:w-1/2 items-center justify-center p-8 bg-white shadow-lg">
                <div className="flex gap-4 justify-center items-center mb-3">
                    <motion.h1 className="text-4xl font-bold text-orange-400">
                        <span className="text-green-400">Book</span> Mart
                    </motion.h1>
                    <img src="/book.gif" className="w-16 rounded-full" alt="Book Mart Logo" />
                </div>

                <form className="w-full max-w-xs" onSubmit={handleSubmit}>
                    {['email', 'password'].map((field, idx) => (
                        <motion.div key={field} className="mb-3"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.2 }}>
                            <label className="block text-gray-700 capitalize">{field}</label>
                            <input
                                type={field === "password" ? "password" : "email"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-1 rounded-md focus:border-orange-500 hover:border-orange-500 focus:border-2 outline-none transition"
                                placeholder={`Enter ${field}`}
                                required
                            />
                        </motion.div>
                    ))}

                    <motion.button type="submit"
                        className="w-full bg-yellow-300 text-white p-3 rounded-lg hover:bg-blue-400 transition transform cursor-pointer hover:scale-105"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}>
                        {isLoading ? "Logging in..." : "Login"}
                    </motion.button>

                    {/* Forgot Password Link */}
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Forgot password?{" "}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/forgotpassword")}
                        >
                            Reset here
                        </span>
                    </p>

                    {/* Register Link */}
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Don't have an account?{" "}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/signup")}
                        >
                            Register here
                        </span>
                    </p>
                </form>

                {/* Social Login Buttons */}
                <div className="w-full max-w-xs mt-3 flex flex-col gap-3">
                    <motion.button className="cursor-pointer flex items-center justify-center border border-gray-300 p-1 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                        <FaGithub className="mr-2" /> Login with GitHub
                    </motion.button>
                    <motion.button className="cursor-pointer flex items-center justify-center border border-gray-300 p-1 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                        <FaGoogle className="mr-2 text-red-500" /> Login with Google
                    </motion.button>
                </div>

                {/* Display Error */}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>

            {/* Right Side: Image Slider */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-amber-500 relative rounded-l-4xl">
                <motion.p className="absolute top-14 text-white text-xl md:text-3xl font-bold px-4 text-center font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}>
                    <Typewriter
                        words={["Expand your knowledge.", "Discover new worlds.", "Learn something new today."]}
                        loop={true}
                        cursor
                        delaySpeed={3000}
                    />
                </motion.p>

                {images.map((src, index) => (
                    <motion.img
                        key={index}
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className={`absolute mt-4 object-cover w-[25vw] h-[50vh] rounded-lg bg-white shadow-xl transition-all duration-700 ${index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                    />
                ))}

                <div className="absolute bottom-24 flex gap-2">
                    {images.map((_, index) => (
                        <span key={index} className={`w-6 h-2 rounded-lg transition-all ${index === currentImageIndex ? "bg-purple-500" : "bg-gray-100"}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}