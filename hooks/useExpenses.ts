'use client';
import { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, Stats } from '@/app/types';
import { useAuth } from '@/app/context/AuthContext';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const loadExpenses = () => {
    try {
      const allExpenses = JSON.parse(localStorage.getItem('expenseTracker') || '[]');
      // Filter expenses for current user
      const userExpenses = allExpenses.filter((exp: Expense) => exp.userId === user?.id);
      setExpenses(userExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    try {
      const allExpenses = JSON.parse(localStorage.getItem('expenseTracker') || '[]');
      // Remove old expenses for current user
      const otherUsersExpenses = allExpenses.filter((exp: Expense) => exp.userId !== user?.id);
      // Add updated expenses for current user
      const updatedExpenses = [...otherUsersExpenses, ...newExpenses];
      localStorage.setItem('expenseTracker', JSON.stringify(updatedExpenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const addExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
      description: data.description,
      type: data.type,
      date: data.date,
      category: data.category,
      createdAt: new Date().toISOString(),
      userId: user?.id,
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, data: ExpenseFormData) => {
    const updatedExpenses = expenses.map(exp => 
      exp.id === id ? {
        ...exp,
        amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
        description: data.description,
        type: data.type,
        date: data.date,
        category: data.category,
      } : exp
    );
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const getStats = (): Stats => {
    const totalIncome = expenses
      .filter(exp => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const totalExpenses = expenses
      .filter(exp => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses.filter(exp => exp.date === today);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    return {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      todayIncome: todayExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      todayExpenses: todayExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      monthlyIncome: monthlyExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      monthlyExpenses: monthlyExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      monthlySavings: monthlyExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0) -
                     monthlyExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
    };
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getStats,
  };
};