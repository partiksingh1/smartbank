import axios from 'axios';
import type {
    LoginRequest,
    LoginResponse,
    UserRequest,
    User,
    Account,
    AccountRequest,
    Transaction,
    TransactionRequest,
    PasswordResetRequest,
    PasswordResetVerify,
    OtpRequest
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_BASE_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
    register: (data: UserRequest) => api.post<User>('/auth/signup', data),
    getCurrentUser: () => api.get<User>('/users/profile'),
    requestPasswordReset: (data: OtpRequest) => api.post('/auth/otp/request', data),
    resetPassword: (data: { email: string, otp: string, newPassword: string }) => api.post('/auth/otp/reset', data)
};

// Account API
export const accountAPI = {
    createAccount: (data: AccountRequest) => api.post<Account>('/account', data),
    getAccount: () => api.get<Account>(`/account`),
};

// Transaction API
export const transactionAPI = {
    //getTransactions: (accountId: number) => api.get<Transaction[]>(`/transaction/${accountId}`),
    createTransaction: (data: TransactionRequest) => api.post<Transaction>('/transaction', data),
    getAllTransactions: () => api.get<Transaction[]>('/transaction'),
};

// Password Reset API
export const passwordResetAPI = {
    requestReset: (data: PasswordResetRequest) => api.post('/password-reset/request', data),
    verifyReset: (data: PasswordResetVerify) => api.post('/password-reset/verify', data),
};

export default api;