export interface User {
    id: number;
    name: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}
export interface OtpRequest {
    email: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface UserRequest {
    name: string;
    email: string;
    password: string;
    countryCode: string;
    phoneNumber: string;
    address: string;
}

export interface Account {
    id: number;
    accountNumber: string;
    accountType: AccountType;
    balance: number;
    branch: string;
    userId: number;
}

export interface AccountRequest {
    accountType: AccountType;
    branch: string;
}

export interface Transaction {
    id: number;
    amount: number;
    transactionDate: string;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
}

export interface TransactionRequest {
    amount: number;
    transactionType: TransactionType;
    fromAccountId?: number;
    toAccountId?: number;
}

export enum AccountType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
    LOAN = 'LOAN',
    CREDIT = 'CREDIT'
}

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetVerify {
    token: string;
    newPassword: string;
}