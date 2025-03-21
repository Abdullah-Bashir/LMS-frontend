// pages/user-dashboard.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBorrowedBooks } from "../redux/slices/borrowSlice"; // adjust the import path as needed
import { getUser } from "../redux/slices/authSlice"; // adjust the import path as needed
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
    const dispatch = useDispatch();
    const { user, isLoading: authLoading, error: authError } = useSelector(
        (state) => state.auth
    );
    const { myBorrowedBooks, status: borrowStatus, error: borrowError } = useSelector(
        (state) => state.borrow
    );

    useEffect(() => {
        if (!user) {
            dispatch(getUser());
        }
        dispatch(fetchMyBorrowedBooks());
    }, [dispatch, user]);

    // Compute counts for returned and borrowed (not returned) books
    const returnedBooks = myBorrowedBooks.filter((book) => book.returned).length;
    const notReturnedBooks = myBorrowedBooks.filter((book) => !book.returned).length;

    const data = {
        labels: ["Returned Books", "Borrowed (Not Returned)"],
        datasets: [
            {
                data: [returnedBooks, notReturnedBooks],
                backgroundColor: ["#36A2EB", "#FF6384"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: "50%", // donut-style chart
    };

    const isLoading = authLoading || borrowStatus === "loading";
    const combinedError = authError || borrowError;

    return (
        <motion.div
            className="user-dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "auto",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <motion.h1
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                    fontSize: "2rem",
                    color: "#e65100",
                }}
            >
                <p className="font-bold">User Dashboard</p>
            </motion.h1>

            {isLoading && <p>Loading your profile and borrowed books...</p>}
            {combinedError && <p style={{ color: "red" }}>{combinedError}</p>}

            {!isLoading && !combinedError && user && (
                <motion.div
                    className="dashboard-container"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "20px",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {/* Left Panel: User Profile Sidebar */}
                    <motion.div
                        className="profile-sidebar"
                        style={{
                            flex: "1",
                            padding: "20px",
                            background: "linear-gradient(135deg, #ffe6cc, #fff9e6)",
                            border: "2px solid #ffcc80",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            borderRadius: "20px"
                        }}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}

                    >
                        <h2
                            style={{
                                fontSize: "1.8rem",
                                marginBottom: "20px",
                                textAlign: "center",
                                color: "#e65100",
                            }}
                        >
                            My Profile
                        </h2>
                        <p style={{ fontSize: "1.2rem", margin: "10px 0", color: "#bf360c" }}>
                            <strong>Username:</strong> {user.username || "N/A"}
                        </p>
                        <p style={{ fontSize: "1.2rem", margin: "10px 0", color: "#bf360c" }}>
                            <strong>Email:</strong> {user.email || "N/A"}
                        </p>
                        <p style={{ fontSize: "1.2rem", margin: "10px 0", color: "#bf360c" }}>
                            <strong>Role:</strong> {user.role || "N/A"}
                        </p>
                    </motion.div>

                    {/* Right Panel: Borrowed vs Returned Books Chart */}
                    <motion.div
                        className="chart-panel"
                        style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <motion.div
                            className="chart-container"
                            style={{ width: "250px", height: "250px" }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Doughnut data={data} options={options} />
                        </motion.div>
                        <motion.div
                            className="chart-info"
                            style={{ marginTop: "20px", textAlign: "center", fontSize: "1.1rem" }}
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <p>Returned Books: {returnedBooks}</p>
                            <p>Borrowed (Not Returned) Books: {notReturnedBooks}</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default UserDashboard;
