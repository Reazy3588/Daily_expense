import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatsCardProps {
    title: string;
    amount: number;
    type: 'income' | 'expense' | 'savings' | 'today';
    icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, amount, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'income':
                return <TrendingUp className="w-6 h-6 text-green-600" />;
            case 'expense':
                return <TrendingDown className="w-6 h-6 text-red-600" />;
            case 'savings':
                return <Wallet className="w-6 h-6 text-blue-600" />;
            default:
                return <Calendar className="w-6 h-6 text-purple-600" />;
        }
    };

    const getColor = () => {
        if (type === 'income') return 'text-green-600';
        if (type === 'expense') return 'text-red-600';
        if (type === 'savings') return 'text-blue-600';
        return 'text-purple-600';
    };

    return (
        <Card className="hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className={`text-2xl font-bold ${getColor()}`}>
                        ${amount.toLocaleString()}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">{getIcon()}</div>
            </div>
        </Card>
    );
};