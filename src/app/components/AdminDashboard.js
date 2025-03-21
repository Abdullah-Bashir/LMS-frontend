// pages/admin.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBorrowedBooks } from "../redux/slices/borrowSlice"; // adjust the import path as needed
import { fetchAllUsers } from "../redux/slices/userSlice"; // adjust the import path as needed
import { fetchBooks } from "../redux/slices/bookSlice"; // adjust the import path as needed
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
    const dispatch = useDispatch();
    const { borrowedBooks, status: borrowStatus, error: borrowError } = useSelector(
        (state) => state.borrow
    );
    const { users, status: userStatus, error: userError } = useSelector((state) => state.user);
    const { books, status: bookStatus, error: bookError } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBorrowedBooks());
        dispatch(fetchAllUsers());
        dispatch(fetchBooks());
    }, [dispatch]);

    // Calculate the counts for returned and not returned books
    const returnedBooks = borrowedBooks.filter((book) => book.returned).length;
    const notReturnedBooks = borrowedBooks.filter((book) => !book.returned).length;

    // Total users and books count
    const totalUsers = users.length;
    const totalBooks = books.length;

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
        cutout: "50%", // creates a donut-style chart
    };

    // Determine if any slice is loading or has errors
    const isLoading =
        borrowStatus === "loading" || userStatus === "loading" || bookStatus === "loading";
    const combinedError = borrowError || userError || bookError;

    return (
        <motion.div
            className="admin-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                padding: "20px",
                fontSize: "0.85rem",
                maxWidth: "800px",
                margin: "auto",
            }}
        >
            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "1.5rem",
                }}
            >
                <p className="font-mono font-extrabold text-4xl mb-8 text-orange-400">Admin Dashboard</p>
            </motion.h1>

            {isLoading && <p>Loading...</p>}
            {combinedError && <p style={{ color: "red" }}>{combinedError}</p>}

            {!isLoading && !combinedError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Left Side: Total Users, Total Books, and Quote */}
                    <motion.div
                        className="left-panel"
                        style={{
                            width: "40%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div
                            className="stats-container"
                            style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                                marginBottom: "20px",
                            }}
                        >
                            <motion.div
                                className="stat-box"
                                style={{
                                    background: "#e0f7fa",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    flex: 1,
                                    marginRight: "10px",
                                    textAlign: "center",
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Total Users</h2>
                                <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                                    {totalUsers}
                                </p>
                            </motion.div>
                            <motion.div
                                className="stat-box"
                                style={{
                                    background: "#e0f7fa",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    flex: 1,
                                    marginLeft: "10px",
                                    textAlign: "center",
                                }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Total Books</h2>
                                <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                                    {totalBooks}
                                </p>
                            </motion.div>
                        </div>
                        <motion.div
                            className="quote"
                            style={{
                                background: "#fff3e0",
                                padding: "10px 15px",
                                borderLeft: "4px solid #ff9800",
                                borderRadius: "4px",
                                fontStyle: "italic",
                                width: "100%",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <p style={{ margin: 0 }}>
                                "The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Doughnut Chart and Comparison Info */}
                    <motion.div
                        className="chart-panel"
                        style={{
                            width: "55%",
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
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            style={{ marginTop: "20px", fontSize: "0.8rem" }}
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

export default AdminPanel;
