import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/auth/login", { email, password });
            localStorage.setItem("token", res.data);
            onLogin();
            navigate("/"); // ✅ redirect to main page (ExpenseForm)
        } catch (err) {
            setError("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <h2>🔐 Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className="error-text">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
