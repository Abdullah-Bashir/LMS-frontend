"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { validateToken } from "@/app/redux/slices/authSlice";

export default function AuthLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    // Check token validity on mount
    useEffect(() => {
        const checkToken = async () => {
            try {
                // Validate token
                await dispatch(validateToken()).unwrap();

                // If token is valid, redirect to home
                router.push("/");
            } catch (error) {
                // Token is invalid or doesn't exist, allow access to auth routes
            }
        };

        checkToken();
    }, [dispatch, router]);

    // Show loader while checking token
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    className="flex space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    <motion.span
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.span
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            ease: "easeInOut",
                            delay: 0.2,
                        }}
                    />
                    <motion.span
                        className="w-3 h-3 bg-blue-500 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.6,
                            ease: "easeInOut",
                            delay: 0.4,
                        }}
                    />
                </motion.div>
            </div>
        );
    }

    // If no token or invalid token, show auth routes
    return !user ? <div>{children}</div> : null;
}