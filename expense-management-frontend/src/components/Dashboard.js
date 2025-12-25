// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import api from "../axiosConfig";

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await api.get("/expenses");
                setExpenses(res.data);
            } catch (err) {
                console.error("Unauthorized or failed to fetch expenses");
            }
        };
        fetchExpenses();
    }, []);

    return (
        <div className="dashboard">
            <h2>💰 Expense Dashboard</h2>
            <ul>
                {expenses.map((exp) => (
                    <li key={exp.id}>{exp.description} - {exp.amount}</li>
                ))}
            </ul>
        </div>
    );
}
