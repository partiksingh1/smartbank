import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { transactionAPI, accountAPI } from '../services/api';
import {
    type Transaction,
    type Account,
    TransactionType,
    TransactionStatus,
} from '../types';
import { Plus, ArrowUp, ArrowDown, TrendingUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [account, setAccount] = useState<Account>();
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');

    const initialFormData = {
        amount: '',
        transactionType: TransactionType.DEPOSIT,
        sourceAccount: '',
        targetAccount: '',
        pin: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (account) {
            setFormData(prev => ({
                ...prev,
                sourceAccount: account.accountNumber.toString(),
            }));
        }
    }, [account]);

    useEffect(() => {
        if (formData.transactionType !== TransactionType.TRANSFER) {
            setFormData(prev => ({ ...prev, targetAccount: '' }));
        }
    }, [formData.transactionType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [txRes, accRes] = await Promise.all([
                transactionAPI.getAllTransactions(),
                accountAPI.getAccount(),
            ]);
            setTransactions(txRes.data);
            setAccount(accRes.data);
        } catch (error: any) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        const { amount, pin, sourceAccount, targetAccount, transactionType } = formData;

        if (!pin || parseFloat(amount) <= 0 || !sourceAccount) {
            toast.error('Please fill in all required fields');
            setCreateLoading(false);
            return;
        }

        if (transactionType === TransactionType.TRANSFER && sourceAccount === targetAccount) {
            toast.error('Source and target accounts must be different');
            setCreateLoading(false);
            return;
        }

        try {
            const payload: any = {
                amount: parseFloat(amount),
                transactionType,
                pin,
                sourceAccountNumber: sourceAccount.trim(),
            };

            if (transactionType === TransactionType.TRANSFER) {
                payload.targetAccountNumber = targetAccount.trim();
            }

            await transactionAPI.createTransaction(payload);
            toast.success('Transaction created successfully!');
            setShowCreateForm(false);
            setFormData({
                ...initialFormData,
                sourceAccount: account?.accountNumber.toString() ?? '',
            });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create transaction');
        } finally {
            setCreateLoading(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return filter === 'ALL'
            ? transactions
            : transactions.filter(t => t.transactionType === filter);
    }, [transactions, filter]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const formatAmount = (amount: number) =>
        `₹${amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const getStatusBadge = (status: TransactionStatus) => {
        const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
        switch (status) {
            case TransactionStatus.COMPLETED:
                return `${base} bg-green-100 text-green-800`;
            case TransactionStatus.PENDING:
                return `${base} bg-yellow-100 text-yellow-800`;
            case TransactionStatus.FAILED:
                return `${base} bg-red-100 text-red-800`;
            default:
                return base;
        }
    };

    const renderIcon = (type: TransactionType) => {
        switch (type) {
            case TransactionType.DEPOSIT:
                return <ArrowUp className="text-green-600 w-5 h-5" />;
            case TransactionType.WITHDRAWAL:
                return <ArrowDown className="text-red-600 w-5 h-5" />;
            case TransactionType.TRANSFER:
                return <TrendingUp className="text-blue-600 w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                        <p className="text-gray-600 text-sm">View and manage your recent transactions</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Transaction
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    {['ALL', ...Object.values(TransactionType)].map(ftype => (
                        <button
                            key={ftype}
                            onClick={() => setFilter(ftype as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ${filter === ftype
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {ftype}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Transactions List */}
                        {filteredTransactions.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Transaction History ({filteredTransactions.length})
                                    </h2>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {filteredTransactions.map(transaction => (
                                        <li key={transaction.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-100 rounded-md">{renderIcon(transaction.transactionType)}</div>
                                                <div>
                                                    <h3 className="text-base font-medium capitalize text-gray-900">
                                                        {transaction.transactionType.toLowerCase()}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{formatDate(transaction.transactionDate)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-xl font-semibold ${transaction.transactionType === TransactionType.DEPOSIT
                                                            ? 'text-green-600'
                                                            : transaction.transactionType === TransactionType.WITHDRAWAL
                                                                ? 'text-red-600'
                                                                : 'text-blue-600'
                                                        }`}
                                                >
                                                    {transaction.transactionType === TransactionType.DEPOSIT
                                                        ? '+'
                                                        : transaction.transactionType === TransactionType.WITHDRAWAL
                                                            ? '-'
                                                            : ''}
                                                    {formatAmount(transaction.amount)}
                                                </p>
                                                <span className={getStatusBadge(transaction.transactionStatus)}>
                                                    {transaction.transactionStatus.toLowerCase()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h2>
                                <p className="text-gray-600 mb-6">Create your first transaction to get started</p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Transaction
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">New Transaction</h2>
                            <form onSubmit={handleCreateTransaction} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Transaction Type</label>
                                    <select
                                        value={formData.transactionType}
                                        onChange={e =>
                                            setFormData({ ...formData, transactionType: e.target.value as TransactionType })
                                        }
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                        required
                                    >
                                        <option value={TransactionType.DEPOSIT}>Deposit</option>
                                        <option value={TransactionType.WITHDRAWAL}>Withdrawal</option>
                                        <option value={TransactionType.TRANSFER}>Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                {(formData.transactionType === TransactionType.TRANSFER || formData.transactionType === TransactionType.DEPOSIT) && (
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-1">Target Account</label>
                                        <input
                                            type="text"
                                            value={formData.targetAccount}
                                            onChange={e => setFormData({ ...formData, targetAccount: e.target.value })}
                                            className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                            placeholder="Enter target account number"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">PIN</label>
                                    <input
                                        type="password"
                                        value={formData.pin}
                                        onChange={e => setFormData({ ...formData, pin: e.target.value })}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                        placeholder="Enter your PIN"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="w-1/2 border border-gray-300 py-2 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {createLoading ? 'Processing...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Transactions;
