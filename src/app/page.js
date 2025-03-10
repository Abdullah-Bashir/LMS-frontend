"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import BookManagement from "./components/BookManagement";
import BorrowedBooks from "./components/BorrowedBooks";
import Catalog from "./components/Catalog";
import Users from "./components/User";

import AddNewAdminPopup from "./popups/AddNewAdminPopup";
import SettingPopup from "./popups/SettingPopup";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser, validateToken } from "@/app/redux/slices/authSlice";



const Loader = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-12 h-12 border-8 border-orange-500 border-t-transparent rounded-full"
  />
);

export default function Home() {
  const [activeComponent, setActiveComponent] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { addnewadminpopup, settingpopup } = useSelector((state) => state.popup); // Add settingpopup

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(validateToken()).unwrap();
      } catch (error) {
        router.push("/auth/login");
      }
    };

    if (!user) checkAuth();
  }, [dispatch, router, user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  // Render component based on active selection
  const renderComponent = () => {
    if (!activeComponent) {
      return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
    }

    switch (activeComponent) {
      case "AdminDashboard":
        return <AdminDashboard />;
      case "UserDashboard":
        return <UserDashboard />;
      case "BookManagement":
        return <BookManagement />;
      case "BorrowedBooks":
        return <BorrowedBooks />;
      case "Catalog":
        return <Catalog />;
      case "Users":
        return <Users />;
      default:
        return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <Sidebar
        setComponent={setActiveComponent}
        userRole={user.role}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:ml-56 mt-16">
        <Header user={user} />
        <motion.div
          key={activeComponent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderComponent()}
        </motion.div>
      </main>

      {addnewadminpopup && <AddNewAdminPopup />}
      {settingpopup && <SettingPopup />} {/* Add SettingPopup */}
    </div>
  );
}