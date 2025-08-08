import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/authContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal state for password reset
    const [showModal, setShowModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login({ email, password });
            console.log(response);
            login(response.data.token, response.data.user);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authAPI.requestPasswordReset({ email: resetEmail });
            toast.success('OTP sent to your email');
            setOtpSent(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authAPI.resetPassword({ email: resetEmail, otp, newPassword });
            toast.success('Password reset successful');
            setShowModal(false); // Close modal after successful reset
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Password reset failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <CreditCard className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to SmartBank
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/register" className="text-blue-600 hover:text-blue-500">
                            Don't have an account? Sign up
                        </Link>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="mt-2 text-center">
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Forgot your password?
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Reset Modal */}
            {showModal && (
                <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Reset your password</h2>

                        {/* Request OTP Form */}
                        {!otpSent ? (
                            <form onSubmit={handlePasswordResetRequest}>
                                <div className="mb-4">
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                                        Enter your email
                                    </label>
                                    <input
                                        id="resetEmail"
                                        type="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-md"
                                >
                                    Send OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordReset}>
                                <div className="mb-4">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        OTP
                                    </label>
                                    <input
                                        id="otp"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 rounded-md"
                                >
                                    Reset Password
                                </button>
                            </form>
                        )}

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 w-full bg-gray-200 py-2 rounded-md text-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
