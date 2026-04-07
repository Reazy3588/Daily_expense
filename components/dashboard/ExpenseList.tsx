'use client';
import React, { useState } from 'react';
import { Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Expense } from '@/app/types';

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onEdit: (expense: Expense) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

    const filteredExpenses = expenses.filter(exp => {
        if (filter === 'all') return true;
        return exp.type === filter;
    });

    const sortedExpenses = [...filteredExpenses].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Food: 'bg-orange-100 text-orange-700',
            Transport: 'bg-blue-100 text-blue-700',
            Shopping: 'bg-pink-100 text-pink-700',
            Entertainment: 'bg-purple-100 text-purple-700',
            Bills: 'bg-red-100 text-red-700',
            Healthcare: 'bg-green-100 text-green-700',
            Other: 'bg-gray-100 text-gray-700',
        };
        return colors[category] || colors['Other'];
    };

    return (
        <Card title="Transaction History">
            <div className="flex gap-2 mb-4">
                <Button
                    size="sm"
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    onClick={() => setFilter('all')}
                >
                    All
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'income' ? 'success' : 'secondary'}
                    onClick={() => setFilter('income')}
                >
                    Income
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'expense' ? 'danger' : 'secondary'}
                    onClick={() => setFilter('expense')}
                >
                    Expenses
                </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedExpenses.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No transactions yet</p>
                ) : (
                    sortedExpenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-full ${expense.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {expense.type === 'income' ? (
                                        <ArrowUp className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <ArrowDown className="w-4 h-4 text-red-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{expense.description}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(expense.category || 'Other')}`}>
                                            {expense.category || 'Other'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                    <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => onDelete(expense.id)}
                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};