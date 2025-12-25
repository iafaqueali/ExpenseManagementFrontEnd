import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryList.css"; // ✅ external CSS for styling

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:8080/categories");
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p className="loading">Loading categories...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="category-container">
            <h2 className="title">📂 Categories</h2>

            <input
                type="text"
                placeholder="🔍 Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
            />

            {filteredCategories.length === 0 ? (
                <p className="empty">No categories found.</p>
            ) : (
                <div className="category-grid">
                    {filteredCategories.map((c) => (
                        <div key={c.id} className="category-card">
                            <h3>{c.name}</h3>
                            <p>{c.description || "No description available"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
