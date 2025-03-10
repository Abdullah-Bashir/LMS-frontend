"use client";
import { useState } from "react";
import { GiHamburgerMenu, GiOpenBook } from "react-icons/gi";
import { IoClose, IoLogOut, IoSettings } from "react-icons/io5";
import { FaBook, FaUsers, FaClipboardList, FaLayerGroup, FaUserShield } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "@/app/redux/slices/popupSlice";

export default function Sidebar({ setComponent, userRole, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const userMenu = [
        { name: "Dashboard", icon: <MdDashboard />, component: "UserDashboard" },
        { name: "My Borrowed Books", icon: <FaClipboardList />, component: "BorrowedBooks" },
        { name: "Books", icon: <FaBook />, component: "BookManagement" },
        { name: "Update Credentials", icon: <IoSettings />, component: "UpdateCredentials" },
    ];

    const adminMenu = [
        { name: "Dashboard", icon: <MdDashboard />, component: "AdminDashboard" },
        { name: "Books", icon: <FaBook />, component: "BookManagement" },
        { name: "Catalog", icon: <FaLayerGroup />, component: "Catalog" },
        { name: "Users", icon: <FaUsers />, component: "Users" },
        { name: "Add Admin", icon: <FaUserShield />, component: "AddAdmin" },
        { name: "Update Credentials", icon: <IoSettings />, component: "UpdateCredentials" },
    ];

    const handleMenuItemClick = (component) => {
        if (component === "AddAdmin") {
            dispatch(toggleAddNewAdminPopup());
        } else if (component === "UpdateCredentials") {
            dispatch(toggleSettingPopup()); // Open the settings popup
        } else {
            setComponent(component);
        }
    };

    const menuItems = userRole === "user" ? userMenu : adminMenu;

    if (!userRole) {
        return (
            <div className="p-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative z-10">
            <div
                className={`fixed top-0 left-0 h-full w-56 bg-orange-500 text-white p-4 flex flex-col justify-between transition-transform duration-300 rounded-r-xl ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div>
                    <h2 className="text-xl md:text-3xl font-bold text-center font-mono">Book Mart</h2>
                    <div className="w-20 h-20 mx-auto my-4 flex items-center justify-center bg-white rounded-full">
                        <GiOpenBook size={40} className="text-black" />
                    </div>
                    <ul className="mt-8 space-y-2">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white hover:text-orange-400 font-semibold rounded text-sm font-mono transition-all"
                                onClick={() => handleMenuItemClick(item.component)}
                            >
                                {item.icon} {item.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="flex items-center justify-center gap-2 w-full p-3 font-semibold text-red-600 hover:bg-white rounded text-sm font-mono cursor-pointer"
                    onClick={onLogout}
                >
                    <IoLogOut size={20} /> Logout
                </button>
            </div>

            <button
                className="fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
        </div>
    );
}