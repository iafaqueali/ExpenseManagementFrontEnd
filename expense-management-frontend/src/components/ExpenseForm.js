import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpenseForm.css";

export default function ExpenseForm({ categories, users, onAdded }) {
    const [form, setForm] = useState({
        amount: "",
        date: "",
        description: "",
        categoryId: "",
        userId: ""
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (categories?.length > 0) {
            setForm((f) => ({ ...f, categoryId: categories[0].id }));
        }
        if (users?.length > 0) {
            setForm((f) => ({ ...f, userId: users[0].id }));
        }
    }, [categories, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.amount || parseFloat(form.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }
        if (!form.date) {
            newErrors.date = "Date is required";
        }
        if (!form.description || form.description.trim().length < 3) {
            newErrors.description = "Description must be at least 3 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post("http://localhost:8080/expenses", {
                amount: parseFloat(form.amount),
                date: form.date,
                description: form.description.trim(),
                user: { id: parseInt(form.userId, 10) },
                category: { id: parseInt(form.categoryId, 10) }
            });

            setForm({ amount: "", date: "", description: "", categoryId: "", userId: "" });
            setErrors({});
            setSuccess("✅ Expense added successfully!");
            setTimeout(() => setSuccess(""), 3000);
            if (onAdded) onAdded();
        } catch (err) {
            console.error("Error adding expense:", err);
            alert("Failed to add expense.");
        }
    };

    return (
        <div className="form-split-container">
            <div className="form-visual-side">
                <h1 className="visual-heading">Track Your Spending</h1>
                <p className="visual-subtext">Stay in control. Log every rupee. 💸</p>
            </div>

            <div className="form-dark-panel">
                <h2 className="form-title">➕ Add Expense</h2>
                <form onSubmit={handleSubmit} className="form-fields">
                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            className={errors.amount ? "error" : ""}
                        />
                        {errors.amount && <small className="error-text">{errors.amount}</small>}
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            className={errors.date ? "error" : ""}
                        />
                        {errors.date && <small className="error-text">{errors.date}</small>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className={errors.description ? "error" : ""}
                        />
                        {errors.description && <small className="error-text">{errors.description}</small>}
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                            {categories?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>User</label>
                        <select name="userId" value={form.userId} onChange={handleChange}>
                            {users?.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">💾 Save Expense</button>
                    {success && <p className="success-text">{success}</p>}
                </form>
            </div>
        </div>
    );
}
