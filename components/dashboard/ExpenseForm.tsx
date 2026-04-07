'use client';
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ExpenseFormData, CategoryType } from '@/app/types';

interface ExpenseFormProps {
    onSubmit: (data: ExpenseFormData) => void;
    onCancel?: () => void;
    initialData?: ExpenseFormData | null;
}

type ExpenseFormErrors = Partial<Record<keyof ExpenseFormData, string>>;

const categories: CategoryType[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState<ExpenseFormData>(
        initialData || {
            amount: '',
            description: '',
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
            category: 'Other',
        }
    );

    const [errors, setErrors] = useState<ExpenseFormErrors>({});

    const validate = () => {
        const newErrors: ExpenseFormErrors = {};
        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Please enter a description';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            if (!initialData) {
                setFormData({
                    amount: '',
                    description: '',
                    type: 'expense',
                    date: new Date().toISOString().split('T')[0],
                    category: 'Other',
                });
            }
        }
    };

    return (
        <Card title={initialData ? 'Edit Transaction' : 'Add New Transaction'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'expense'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.type === 'income'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                    >
                        Income
                    </button>
                </div>

                <Input
                    label="Amount ($)"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    error={errors.amount}
                    placeholder="0.00"
                />

                <Input
                    label="Description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    error={errors.description}
                    placeholder="e.g., Groceries, Salary, etc."
                />

                <Input
                    label="Category"
                    as="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </Input>

                <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <div className="flex gap-3 pt-2">
                    <Button type="submit" variant="primary" className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        {initialData ? 'Update' : 'Add'} Transaction
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
};