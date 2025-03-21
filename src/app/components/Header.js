"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleSettingPopup } from "@/app/redux/slices/popupSlice";

const Header = ({ user }) => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Set default values if properties are missing
    const safeUser = {
        username: user?.username || "Guest",
        role: user?.role || "user",
        avatar: user?.avatar || null,
    };

    return (
        <header className="fixed top-0 left-0 right-0 md:left-56 h-16 bg-white shadow-md flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                {safeUser.avatar?.url ? (
                    <img
                        src={safeUser.avatar.url}
                        alt={safeUser.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center text-white font-bold">
                        {typeof safeUser.username === "string"
                            ? safeUser.username.charAt(0).toUpperCase()
                            : "G"}
                    </div>
                )}
                <div>
                    <p className="text-lg font-semibold text-gray-800">{safeUser.username}</p>
                    <p className="text-sm text-gray-500">{safeUser.role}</p>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <p className="text-sm text-gray-600">{currentTime}</p>
                <div className="relative">
                    <button
                        onClick={() => dispatch(toggleSettingPopup())}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
