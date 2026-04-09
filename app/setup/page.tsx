'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
    const [status, setStatus] = useState('Setting up...');
    const router = useRouter();

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.length === 0) {
            // Create default admin
            const adminUser = {
                id: Date.now().toString(),
                name: 'Administrator',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString(),
            };

            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
            setStatus('Admin user created! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            setStatus('Users already exist. Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
}