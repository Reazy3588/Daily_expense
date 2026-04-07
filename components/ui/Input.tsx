import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    as?: 'input' | 'select';
    children?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    as = 'input',
    children,
    className = '',
    ...props
}) => {
    const baseClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-300'
        }`;

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            {as === 'input' ? (
                <input className={`${baseClasses} ${className}`} {...props} />
            ) : (
                <select className={`${baseClasses} ${className}`} {...props}>
                    {children}
                </select>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};