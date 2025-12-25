import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CategoryPage.css"; // ✅ external CSS for styling
import { toast } from "react-toastify";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:8080/categories");
            setCategories(res.data);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };

    const handleAdd = async () => {
        if (!newCategory.trim()) return;
        try {
            const res = await axios.post("http://localhost:8080/categories", {
                name: newCategory.trim()
            });
            setCategories([...categories, res.data]);
            setNewCategory("");
            toast.success("Category added!");
        } catch (err) {
            toast.error("Error adding category");
        }
    };

    const handleEdit = (id, name) => {
        setEditingId(id);
        setEditedName(name);
    };

    const handleUpdate = async (id) => {
        if (!editedName.trim()) return;
        try {
            const res = await axios.put(`http://localhost:8080/categories/${id}`, {
                name: editedName.trim()
            });
            setCategories(categories.map((cat) => (cat.id === id ? res.data : cat)));
            setEditingId(null);
            setEditedName("");
            toast.success("Category updated!");
        } catch (err) {
            toast.error("Error updating category");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/categories/${id}`);
            setCategories(categories.filter((cat) => cat.id !== id));
            toast.success("Category deleted!");
        } catch (err) {
            toast.error("Error deleting category");
        }
    };

    return (
        <div className="category-page">
            <h2 className="page-title">📂 Manage Categories</h2>

            <div className="add-category">
                <input
                    type="text"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAdd}>➕ Add</button>
            </div>

            <div className="category-grid">
                {categories.map((cat) => (
                    <div key={cat.id} className="category-card">
                        {editingId === cat.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="edit-input"
                                />
                                <button onClick={() => handleUpdate(cat.id)} className="save-btn">💾 Save</button>
                                <button onClick={() => setEditingId(null)} className="cancel-btn">❌ Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="category-name">{cat.name}</span>
                                <div className="action-buttons">
                                    <button onClick={() => handleEdit(cat.id, cat.name)} className="edit-btn">✏️</button>
                                    <button onClick={() => handleDelete(cat.id)} className="delete-btn">🗑️</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
