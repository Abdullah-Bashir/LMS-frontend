"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "@/app/redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (status === "failed") {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 font-mono">Users</h1>

            {/* Scroll container for small screens */}
            <div className="overflow-auto mx-auto flex justify-center items-center">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avatar
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Verified
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Borrowed Books
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-4 py-4">
                                    {user.avatar?.url ? (
                                        <img
                                            src={user.avatar.url}
                                            alt={user.username}
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">{user.username}</td>
                                <td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
                                <td className="px-4 py-4 text-sm">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                    {user.accountVerified ? (
                                        <span className="text-green-600 font-semibold">Verified</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Not Verified</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                    {user.borrowedBooks?.length || 0}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Users;
