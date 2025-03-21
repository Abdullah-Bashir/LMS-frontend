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

    if (status === "loading") return <div className="text-center mt-8">Loading...</div>;
    if (status === "failed") return <div className="text-red-500 text-center mt-8">Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-xl font-semibold mb-4">Users</h1>
            <div className="overflow-x-auto rounded-lg border shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Avatar</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Username</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Role</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-600">Verified</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {user.avatar?.url ? (
                                            <img
                                                src={user.avatar.url}
                                                alt={user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">{user.username}</td>
                                    <td className="px-4 py-2 text-gray-600">{user.email}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {user.accountVerified ? (
                                            <span className="text-green-600 font-semibold">Verified</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Not Verified</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Users;
