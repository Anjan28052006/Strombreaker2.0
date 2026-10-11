export type UserRole = "CUSTOMER" | "BANKER" | "MANAGER";
export type UserStatus = "PENDING" | "ACTIVE" | "FROZEN" | "BLOCKED" | "REJECTED";
export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED";
export type TransactionStatus = "PREPARED" | "PENDING_REVIEW" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED" | "EXPIRED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  accountStatus: UserStatus;
  maliciousAttemptCount?: number;
  warningCount?: number;
  accountNumber?: string | null;
  account?: AccountDetails | null;
}

export interface AccountDetails {
  accountNumber: string;
  maskedAccountNumber?: string;
  balancePaise: number;
  balanceRupees: number;
  currency: string;
  status: AccountStatus;
  accountType: string;
}

export interface Transaction {
  id: string;
  reference: string;
  type: "INCOMING" | "OUTGOING";
  amountPaise: number;
  amountRupees: number;
  memo: string;
  status: TransactionStatus;
  counterpartyAccountNumber: string;
  counterpartyRawAccountNumber?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface PreparedTransfer {
  transactionId: string;
  reference: string;
  recipientDisplayName: string;
  maskedRecipientAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  amountPaise: number;
  currency: string;
  memo: string;
  expiresAt: string;
  confirmationToken: string;
  requiresConfirmation: boolean;
}

export interface ConfirmedTransferResult {
  transactionId: string;
  reference: string;
  status: string;
  amount: number;
  amountPaise: number;
  currency: string;
  recipientAccountNumber: string;
  senderAccountNumber: string;
  confirmedAt: string;
  memo: string;
}

export interface SecurityEvent {
  _id: string;
  userId?: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  threatCategory: "PROMPT_INJECTION" | "JAILBREAK" | "POLICY_OVERRIDE" | "MEMO_INJECTION" | "OBFUSCATION" | "UNAUTHORIZED_ACCESS" | "NONE";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  verdict: "APPROVE" | "BLOCK";
  sanitizedEvidence: string;
  actionTaken: string;
  createdAt: string;
}

export interface FirewallCheckResult {
  verdict: "APPROVE" | "BLOCK";
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  threat_category: string;
  rationale: string;
  intent?: string | null;
  requires_confirmation?: boolean;
  permitted_action?: string | null;
}

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  resourceType: string;
  resourceId?: string;
  readAt?: string | null;
  createdAt: string;
}

export interface OperationalRequest {
  id: string;
  reference: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  amount: number;
  amountPaise: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string;
  createdAt: string;
  decisionReason?: string;
  reviewedAt?: string;
  userId?: {
    fullName: string;
    email: string;
  };
  accountId?: {
    accountNumber: string;
    balancePaise: number;
  };
}

export interface LoanApplication {
  id: string;
  reference: string;
  loanType: string;
  requestedAmount: number;
  requestedAmountPaise: number;
  status: "DRAFT" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "NEEDS_INFORMATION";
  applicationDetails: {
    purpose: string;
    annualIncomePaise: number;
    employmentStatus: string;
    tenureMonths: number;
    notes: string;
  };
  applicant?: {
    fullName: string;
    email: string;
  };
  reviewedAt?: string;
  decisionReason?: string;
  createdAt: string;
}
