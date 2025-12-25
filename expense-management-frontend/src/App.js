import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseDashboard from "./components/ExpenseDashboard";
import CategoryPage from "./components/CategoryPage";
import "./App.css";

function App() {
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8080/categories");
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8080/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchCategories();
        fetchUsers();
    }, []);

    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1>💼 Expense Management</h1>
                </header>

                <nav className="app-navbar">
                    <Link to="/" className="nav-link">➕ Add Expense</Link>
                    <Link to="/dashboard" className="nav-link">💰 Dashboard</Link>
                    <Link to="/categories" className="nav-link">📂 Categories</Link>
                </nav>

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<ExpenseForm categories={categories} users={users} />} />
                        <Route path="/dashboard" element={<ExpenseDashboard />} />
                        <Route path="/categories" element={<CategoryPage />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>© {new Date().getFullYear()} Expense Manager </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
