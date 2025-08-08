import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { accountAPI } from '../services/api';
import { AccountType, type Account } from '../types';
import { Plus, CreditCard, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Accounts: React.FC = () => {
    const [account, setAccount] = useState<Account>();
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountType: AccountType.SAVINGS,
        branch: '',
        pin: ''
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await accountAPI.getAccount();
            setAccount(response.data);
        } catch (error: any) {
            toast.error('Failed to fetch accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            await accountAPI.createAccount(formData);
            toast.success('Account created successfully!');
            setShowCreateForm(false);
            setFormData({ accountType: AccountType.SAVINGS, branch: '', pin: '' });
            fetchAccounts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setCreateLoading(false);
        }
    };

    const getAccountTypeColor = (type: AccountType) => {
        switch (type) {
            case AccountType.SAVINGS:
                return 'bg-green-100 text-green-800';
            case AccountType.CURRENT:
                return 'bg-blue-100 text-blue-800';
            case AccountType.LOAN:
                return 'bg-red-100 text-red-800';
            case AccountType.CREDIT:
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
                        <p className="text-gray-600">Manage your banking accounts</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Account
                    </button>
                </div>

                {/* Create Account Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h2>
                            <form onSubmit={handleCreateAccount} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Account Type
                                    </label>
                                    <select
                                        value={formData.accountType}
                                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value as AccountType })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value={AccountType.SAVINGS}>Savings Account</option>
                                        <option value={AccountType.CURRENT}>Current Account</option>
                                        <option value={AccountType.LOAN}>Loan Account</option>
                                        <option value={AccountType.CREDIT}>Credit Account</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter branch name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        PIN
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.pin}
                                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter a PIN"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {createLoading ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Account Display */}
                {account ? (
                    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-8 w-8 text-blue-600" />
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getAccountTypeColor(account.accountType)}`}
                                >
                                    {account.accountType}
                                </span>
                            </div>
                            <button className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {account.accountType.replace('_', ' ')} Account
                            </h3>
                            <p className="text-gray-600">Account Number: {account.accountNumber}</p>
                            <p className="text-sm text-gray-500">Branch: {account.branch}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Current Balance</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{account.balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Account Found</h2>
                        <p className="text-gray-600 mb-6">Create your first account to get started with SmartBank</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Your First Account
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Accounts;
