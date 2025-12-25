import axios from "axios";

const API_BASE = "http://localhost:8080"; // Spring Boot backend

export const getUsers = () => axios.get(`${API_BASE}/users`);
export const createUser = (user) => axios.post(`${API_BASE}/users`, user);


export const createCategory = (category) =>
    axios.post(`${API_BASE}/categories`, category);
// ✅ Fetch all expenses for a user
export const getExpenses = (userId) =>
    axios.get(`${API_BASE}/expenses/user/${userId}`);

// ✅ Fetch all categories for a user
export const getCategories = (userId) =>
    axios.get(`${API_BASE}/categories/user/${userId}`);

export const createExpense = (expense) =>
    axios.post(
        `${API_BASE}/expenses?userId=${expense.userId}&categoryId=${expense.categoryId}`,
        {
            amount: expense.amount,
            date: expense.date,
            description: expense.description
        }
    );