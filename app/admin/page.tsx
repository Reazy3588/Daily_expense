'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
    TrendingUp, TrendingDown, Wallet, Calendar, Users, DollarSign,
    LogOut, Trash2, Edit, Eye, BarChart3, PieChart as PieChartIcon,
    Shield, UserCheck, UserX
} from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

interface Expense {
    id: string;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    date: string;
    category: string;
    createdAt: string;
    userId: string;
    userName: string;
}

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState<User | null>(null);

    useEffect(() => {
        // Check if user is admin
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = () => {
        // Load all expenses
        const expenses = JSON.parse(localStorage.getItem('expenseTracker') || '[]');
        setAllExpenses(expenses);

        // Load all users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const usersWithoutPasswords = users.map((u: any) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });
        setAllUsers(usersWithoutPasswords);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const deleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user? All their data will be lost!')) {
            // Delete user
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter((u: any) => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Delete user's expenses
            const expenses = JSON.parse(localStorage.getItem('expenseTracker') || '[]');
            const updatedExpenses = expenses.filter((e: any) => e.userId !== userId);
            localStorage.setItem('expenseTracker', JSON.stringify(updatedExpenses));

            loadData();
            alert('User deleted successfully');
        }
    };

    const deleteExpense = (expenseId: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            const expenses = JSON.parse(localStorage.getItem('expenseTracker') || '[]');
            const updatedExpenses = expenses.filter((e: any) => e.id !== expenseId);
            localStorage.setItem('expenseTracker', JSON.stringify(updatedExpenses));
            loadData();
        }
    };

    // Filter expenses based on selected user
    const filteredExpenses = selectedUser === 'all'
        ? allExpenses
        : allExpenses.filter(exp => exp.userId === selectedUser);

    // Calculate totals
    const totalIncome = filteredExpenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = filteredExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.role === 'user').length;
    const adminCount = allUsers.filter(u => u.role === 'admin').length;

    // Monthly data for chart
    const getMonthlyData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map((month, index) => {
            const monthExpenses = filteredExpenses.filter(e => {
                const expDate = new Date(e.date);
                return expDate.getMonth() === index && e.type === 'expense';
            }).reduce((sum, e) => sum + e.amount, 0);

            const monthIncome = filteredExpenses.filter(e => {
                const expDate = new Date(e.date);
                return expDate.getMonth() === index && e.type === 'income';
            }).reduce((sum, e) => sum + e.amount, 0);

            return { month, expenses: monthExpenses, income: monthIncome };
        });
        return monthlyData;
    };

    // Category data for pie chart
    const getCategoryData = () => {
        const categories: { [key: string]: number } = {};
        filteredExpenses.filter(e => e.type === 'expense').forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
        });
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    };

    // User spending data
    const getUserSpending = () => {
        const userMap: { [key: string]: { name: string; expenses: number; income: number } } = {};
        allExpenses.forEach(exp => {
            if (!userMap[exp.userId]) {
                const user = allUsers.find(u => u.id === exp.userId);
                userMap[exp.userId] = {
                    name: user?.name || 'Unknown',
                    expenses: 0,
                    income: 0
                };
            }
            if (exp.type === 'expense') {
                userMap[exp.userId].expenses += exp.amount;
            } else {
                userMap[exp.userId].income += exp.amount;
            }
        });
        return Object.values(userMap);
    };

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8" />
                            <div>
                                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                                <p className="text-purple-100 text-sm">Manage all users and transactions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-purple-100">Welcome,</p>
                                <p className="font-semibold">{user?.name} (Admin)</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Admin Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-purple-600">{totalUsers}</p>
                                <p className="text-xs text-gray-500 mt-1">{activeUsers} Active Users</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Total Income (All)</p>
                                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Total Expenses (All)</p>
                                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-600 text-sm">Admin Count</p>
                                <p className="text-2xl font-bold text-blue-600">{adminCount}</p>
                            </div>
                            <Shield className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* User Filter */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <h3 className="text-lg font-semibold">Filter by User</h3>
                        </div>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Users</option>
                            {allUsers.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.email}) - {u.role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Monthly Overview</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getMonthlyData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                                <Bar dataKey="income" fill="#10B981" name="Income" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Expense Categories</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={getCategoryData()} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                                    {getCategoryData().map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Spending Chart */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">User Spending Comparison</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getUserSpending()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend />
                            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                            <Bar dataKey="income" fill="#10B981" name="Income" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-xl shadow-sm border mb-8">
                    <div className="border-b p-6">
                        <h3 className="text-lg font-semibold">All Users</h3>
                        <p className="text-sm text-gray-500">Manage user accounts</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {allUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {u.role === 'admin' ? <Shield className="w-4 h-4 text-purple-600" /> : <UserCheck className="w-4 h-4 text-green-600" />}
                                                <span className="font-medium">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => deleteUser(u.id)}
                                                        className="p-1 hover:bg-red-100 rounded transition-colors"
                                                    >
                                                        <UserX className="w-4 h-4 text-red-600" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* All Transactions */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="border-b p-6">
                        <h3 className="text-lg font-semibold">All Transactions</h3>
                        <p className="text-sm text-gray-500">{filteredExpenses.length} total transactions</p>
                    </div>
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {filteredExpenses.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No transactions found</p>
                        ) : (
                            filteredExpenses.map(exp => {
                                const user = allUsers.find(u => u.id === exp.userId);
                                return (
                                    <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${exp.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {exp.type}
                                                </span>
                                                <span className="text-sm font-medium">{exp.description}</span>
                                            </div>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>User: {user?.name || 'Unknown'}</span>
                                                <span>Category: {exp.category}</span>
                                                <span>Date: {new Date(exp.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${exp.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                ${exp.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteExpense(exp.id)}
                                            className="ml-4 p-1 hover:bg-red-100 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}