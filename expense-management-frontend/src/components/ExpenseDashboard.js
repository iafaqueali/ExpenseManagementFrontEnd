import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseDashboard.css";

export default function ExpenseDashboard({ refresh }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [total, setTotal] = useState(0);

    // ✅ Sorting & Filtering state
    const [sortField, setSortField] = useState("amount"); // "amount" or "date"
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get("http://localhost:8080/expenses");
                setExpenses(res.data);

                const sum = res.data.reduce((acc, e) => acc + (e.amount || 0), 0);
                setTotal(sum);
            } catch (err) {
                console.error("Error fetching expenses:", err);
                setError("Failed to load expenses.");
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [refresh]);

    // ✅ Apply filters
    const filteredExpenses = expenses.filter((e) => {
        const matchesCategory =
            selectedCategory === "all" || (e.category && e.category.name === selectedCategory);

        const matchesDate =
            (!startDate || new Date(e.date) >= new Date(startDate)) &&
            (!endDate || new Date(e.date) <= new Date(endDate));

        return matchesCategory && matchesDate;
    });

    // ✅ Apply sorting (amount or date)
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
        if (sortField === "amount") {
            return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortField === "date") {
            return sortOrder === "asc"
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        }
        return 0;
    });

    if (loading) return <p className="loading">⏳ Loading expenses...</p>;
    if (error) return <p className="error">{error}</p>;

    const categories = [...new Set(expenses.map((e) => e.category?.name).filter(Boolean))];

    const clearFilters = () => {
        setSelectedCategory("all");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="expense-dashboard">
            <h2 className="title">💰 Expense Dashboard</h2>

            {/* ✅ Total amount */}
            <div className="total-card">
                <h3>Total Spent</h3>
                <p className="total-amount">₹{total}</p>
            </div>

            {/* ✅ Filters */}
            <div className="filters">
                <div className="filter-item">
                    <label>Sort Field:</label>
                    <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <option value="amount">Amount</option>
                        <option value="date">Date</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Sort Order:</label>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="desc">High to Low</option>
                        <option value="asc">Low to High</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Filter by Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <button onClick={clearFilters} className="clear-btn">🧹 Clear Filters</button>
                </div>
            </div>

            {/* ✅ Expense list */}
            {sortedExpenses.length === 0 ? (
                <p className="empty">No expenses found.</p>
            ) : (
                <div className="expense-grid">
                    {sortedExpenses.map((e) => (
                        <div key={e.id} className="expense-card">
                            <div className="expense-header">
                                <span className="expense-date">{e.date}</span>
                                <span className="expense-amount">₹{e.amount}</span>
                            </div>
                            <p className="expense-desc">{e.description}</p>
                            {e.category && (
                                <span className="expense-category">📂 {e.category.name}</span>
                            )}
                            {e.user && <span className="expense-user">👤 {e.user.name}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
