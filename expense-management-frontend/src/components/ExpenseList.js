import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseList.css"; // ✅ external CSS for styling

export default function ExpenseList({ refresh }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await axios.get("http://localhost:8080/expenses");
                setExpenses(res.data);
            } catch (err) {
                console.error("Error fetching expenses:", err);
                setError("Failed to load expenses.");
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [refresh]);

    if (loading) return <p className="loading">Loading expenses...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="expense-container">
            <h2 className="title">💰 Expenses</h2>
            {expenses.length === 0 ? (
                <p className="empty">No expenses found.</p>
            ) : (
                <div className="expense-grid">
                    {expenses.map((e) => (
                        <div key={e.id} className="expense-card">
                            <div className="expense-header">
                                <span className="expense-date">{e.date}</span>
                                <span className="expense-amount">₹{e.amount}</span>
                            </div>
                            <p className="expense-desc">{e.description}</p>
                            {e.category && (
                                <span className="expense-category">
                                    📂 {e.category.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
