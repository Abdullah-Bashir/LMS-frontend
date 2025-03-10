"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/redux/slices/authSlice";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export default function Register() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

    // Form state
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });

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
        const resultAction = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Verification email sent! Check your inbox.");

            setInterval(() => {
                router.push(`/auth/verify-otp/${formData.email}`);
            }, 2000);
        }
        else {
            toast.error(error || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* Toast Container for Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Left Side: Image Slider & Typewriter Effect */}
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-amber-500 relative rounded-r-4xl">
                <motion.p className="absolute top-14 text-white text-xl md:text-3xl font-bold px-4 text-center font-mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                    <Typewriter words={["Knowledge is power.", "Books are a uniquely portable magic.", "Read, See, Learn and Grow."]} loop={true} cursor delaySpeed={3000} />
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

            {/* Right Side: Registration Form */}
            <motion.div className="flex flex-col w-full md:w-1/2 items-center justify-center p-8 bg-white shadow-lg" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex gap-4 justify-center items-center mb-3 ">
                    <motion.h1 className="text-4xl font-bold text-orange-400"><span className="text-green-400">Book</span> Mart</motion.h1>
                    <img src="/book.gif" className="w-16 rounded-full" alt=":)" />
                </div>

                <form className="w-full max-w-xs" onSubmit={handleSubmit}>
                    {['username', 'email', 'password'].map((field, idx) => (
                        <motion.div key={field} className="mb-3" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.2 }}>
                            <label className="block text-gray-700 capitalize">{field}</label>
                            <input
                                type={field === "password" ? "password" : "text"}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-1 rounded-md focus:border-orange-500 hover:border-orange-500 focus:border-2 outline-none transition"
                                placeholder={`Enter ${field}`}
                                required
                            />
                        </motion.div>
                    ))}

                    <motion.button type="submit" className="w-full bg-yellow-300 text-white p-3 rounded-lg hover:bg-blue-400 transition transform cursor-pointer hover:scale-105" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                        {isLoading ? "Registering..." : "Register"}
                    </motion.button>

                    {/* Already have an account? */}
                    <p className="mt-2 text-sm text-gray-600 text-center">
                        Already have an account?{" "}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => router.push("/auth/login")}
                        >
                            Login here
                        </span>
                    </p>

                </form>

                <div className="w-full max-w-xs mt-3 flex flex-col gap-3">
                    <motion.button className="cursor-pointer flex items-center justify-center border border-gray-300 p-1 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                        <FaGithub className="mr-2" /> Login with GitHub
                    </motion.button>
                    <motion.button className="cursor-pointer flex items-center justify-center border border-gray-300 p-1 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
                        <FaGoogle className="mr-2 text-red-500" /> Login with Google
                    </motion.button>
                </div>

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </motion.div>

        </div>
    );
}
