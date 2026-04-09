export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user'; // Add role field
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category?: string;
  createdAt: string;
  userId?: string;
  userName?: string; // For admin to see who added
}

export interface ExpenseFormData {
  amount: number | string;
  description: string;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface Stats {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  todayIncome: number;
  todayExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

export type CategoryType = 
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Other';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
}