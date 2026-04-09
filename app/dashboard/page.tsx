'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '@/hooks/useExpenses';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ExpenseForm } from '@/components/dashboard/ExpenseForm';
import { ExpenseList } from '@/components/dashboard/ExpenseList';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Expense } from '../types';
import { LogOut, Shield } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout, isAdmin } = useAuth();
    const router = useRouter();
    const { expenses, addExpense, updateExpense, deleteExpense, getStats } = useExpenses();
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const stats = getStats();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (data: any) => {
        if (editingExpense) {
            updateExpense(editingExpense.id, data);
            setEditingExpense(null);
        } else {
            addExpense(data);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) return null;

    return (
        <>
            <Header>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                        </button>
                    )}
                    <div className="text-right">
                        <p className="text-sm text-blue-100">Welcome,</p>
                        <p className="font-semibold">{user.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </Header>
            <Container>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Total Income" amount={stats.totalIncome} type="income" />
                    <StatsCard title="Total Expenses" amount={stats.totalExpenses} type="expense" />
                    <StatsCard title="Total Savings" amount={stats.savings} type="savings" />
                    <StatsCard title="Today's Spending" amount={stats.todayExpenses} type="today" />
                </div>

                {/* Monthly Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="dashboard-card">
                        <p className="text-sm text-gray-600 mb-1">This Month's Income</p>
                        <p className="text-2xl font-bold text-green-600">${stats.monthlyIncome.toLocaleString()}</p>
                    </div>
                    <div className="dashboard-card">
                        <p className="text-sm text-gray-600 mb-1">This Month's Expenses</p>
                        <p className="text-2xl font-bold text-red-600">${stats.monthlyExpenses.toLocaleString()}</p>
                    </div>
                    <div className="dashboard-card">
                        <p className="text-sm text-gray-600 mb-1">This Month's Savings</p>
                        <p className="text-2xl font-bold text-blue-600">${stats.monthlySavings.toLocaleString()}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <ExpenseForm
                            onSubmit={handleSubmit}
                            initialData={editingExpense ? {
                                amount: editingExpense.amount,
                                description: editingExpense.description,
                                type: editingExpense.type,
                                date: editingExpense.date,
                                category: editingExpense.category || 'Other',
                            } : null}
                            onCancel={editingExpense ? () => setEditingExpense(null) : undefined}
                        />

                        <div className="mt-8">
                            <ExpenseChart expenses={expenses} />
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <ExpenseList
                            expenses={expenses}
                            onDelete={deleteExpense}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </Container>
        </>
    );
}