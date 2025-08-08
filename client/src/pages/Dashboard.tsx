import React, { useEffect, useState, type JSX } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/authContext';
import { accountAPI, transactionAPI } from '../services/api';
import type { Account, Transaction } from '../types';
import {
    CreditCard, TrendingUp, Clock,
    ArrowUp, ArrowDown, IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [account, setAccount] = useState<Account>();
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [accountsRes, transactionsRes] = await Promise.all([
                accountAPI.getAccount(),
                transactionAPI.getAllTransactions()
            ]);

            setAccount(accountsRes.data);
            setRecentTransactions(transactionsRes.data.slice(0, 5));
        } catch (error: any) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const totalBalance = account?.balance ?? 0;

    const transactionIcons: Record<string, JSX.Element> = {
        DEPOSIT: <ArrowUp className="h-4 w-4 text-green-600" />,
        WITHDRAWAL: <ArrowDown className="h-4 w-4 text-red-600" />,
        TRANSFER: <TrendingUp className="h-4 w-4 text-blue-600" />,
    };

    const statusClass = {
        COMPLETED: 'bg-green-100 text-green-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        FAILED: 'bg-red-100 text-red-800',
        DEFAULT: 'bg-gray-100 text-gray-800'
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8">

                {/* Welcome */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-gray-600">Here's an overview of your banking activities.</p>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={<IndianRupee className="h-6 w-6 text-blue-600" />}
                        label="Total Balance"
                        value={`₹${totalBalance.toLocaleString()}`}
                        color="bg-blue-100"
                    />
                    <StatCard
                        icon={<TrendingUp className="h-6 w-6 text-yellow-600" />}
                        label="Recent Transactions"
                        value={recentTransactions.length.toString()}
                        color="bg-yellow-100"
                    />
                    <StatCard
                        icon={<Clock className="h-6 w-6 text-purple-600" />}
                        label="Pending"
                        value={recentTransactions.filter(t => t.transactionStatus === 'PENDING').length.toString()}
                        color="bg-purple-100"
                    />
                </section>

                {/* Content */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Account Summary */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Your Account</h2>
                        </div>
                        <div className="p-6">
                            {account ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{account.accountType.replace('_', ' ')} Account</p>
                                        <p className="text-sm text-gray-600 truncate">{account.accountNumber}</p>
                                        <p className="text-xs text-gray-500">Branch: {account.branch}</p>
                                    </div>
                                    <div className="text-right mt-4 sm:mt-0">
                                        <p className="text-lg font-bold text-gray-900">₹{account.balance.toLocaleString()}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.accountType === 'SAVINGS' ? 'bg-green-100 text-green-800'
                                            : account.accountType === 'CURRENT' ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'}`}>
                                            {account.accountType}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No account found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {recentTransactions.length ? recentTransactions.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {transactionIcons[tx.transactionType]}
                                        <div>
                                            <p className="font-medium text-gray-900">{tx.transactionType.replace('_', ' ')}</p>
                                            <p className="text-sm text-gray-600">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${tx.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.transactionType === 'DEPOSIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass[tx.transactionStatus] || statusClass.DEFAULT
                                            }`}>
                                            {tx.transactionStatus}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No transactions found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

// Reusable Stat Card
const StatCard = ({
    icon,
    label,
    value,
    color
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
}) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className={`p-2 rounded-lg ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default Dashboard;
