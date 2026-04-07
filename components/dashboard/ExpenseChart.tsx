'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../ui/Card';
import { Expense } from '@/app/types';

interface ExpenseChartProps {
    expenses: Expense[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
    const getCategoryData = () => {
        const categoryMap = new Map<string, number>();

        expenses
            .filter(exp => exp.type === 'expense')
            .forEach(exp => {
                const category = exp.category || 'Other';
                categoryMap.set(category, (categoryMap.get(category) || 0) + exp.amount);
            });

        return Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));
    };

    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

    const data = getCategoryData();

    if (data.length === 0) {
        return (
            <Card title="Expense Breakdown">
                <div className="h-64 flex items-center justify-center text-gray-500">
                    No expense data to display
                </div>
            </Card>
        );
    }

    return (
        <Card title="Expense Breakdown by Category">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};