import React from 'react';
import { DollarSign } from 'lucide-react';

interface HeaderProps {
    children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8" />
                        <div>
                            <h1 className="text-2xl font-bold">Expense Tracker</h1>
                            <p className="text-blue-100 text-sm">Track your daily finances</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </header>
    );
};