'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find((u: User) => u.email === email && u.password === password);

            if (user) {
                const { password, ...userWithoutPassword } = user;
                setUser(userWithoutPassword as User);
                localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            if (users.some((u: User) => u.email === email)) {
                return false;
            }

            const newUser: User = {
                id: Date.now().toString(),
                email,
                name,
                password,
                createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            const { password: _, ...userWithoutPassword } = newUser;
            setUser(userWithoutPassword as User);
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};