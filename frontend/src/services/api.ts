const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("bankism_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("bankism_token", token);
    } else {
      localStorage.removeItem("bankism_token");
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("bankism_token");
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `Request failed with status ${response.status}`);
        (error as any).status = response.status;
        (error as any).code = data?.error?.code || "REQUEST_FAILED";
        (error as any).details = data?.error?.details || [];
        throw error;
      }

      return data?.data !== undefined ? data.data : data;
    } catch (err: any) {
      if (err.status === 401 && !endpoint.includes("/auth/login")) {
        // Clear token on 401 unauthorized
        this.setToken(null);
      }
      throw err;
    }
  }

  // --- AUTH ---
  register(payload: { fullName: string; email: string; password: string }) {
    return this.request<{ user: any; message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  login(payload: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getMe() {
    return this.request<any>("/auth/me");
  }

  // --- ACCOUNTS ---
  getMyAccount() {
    return this.request<any>("/accounts/me");
  }

  getMyBalance() {
    return this.request<any>("/accounts/me/balance");
  }

  getMyTransactions(params: { page?: number; limit?: number; type?: string } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.type) query.append("type", params.type);
    return this.request<{ transactions: any[]; pagination: any }>(`/accounts/me/transactions?${query.toString()}`);
  }

  // --- TRANSACTIONS ---
  prepareTransfer(payload: { recipientAccountNumber: string; amount: number; memo?: string }) {
    return this.request<any>("/transactions/prepare", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  confirmTransfer(payload: { transactionId: string; confirmationToken: string }) {
    return this.request<any>("/transactions/confirm", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  cancelTransaction(transactionId: string) {
    return this.request<any>(`/transactions/${transactionId}/cancel`, {
      method: "POST",
    });
  }

  createDepositRequest(payload: { amount: number; notes?: string }) {
    return this.request<any>("/transactions/deposit-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  createWithdrawalRequest(payload: { amount: number; notes?: string }) {
    return this.request<any>("/transactions/withdrawal-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getMyOperationalRequests() {
    return this.request<any[]>("/transactions/requests/me");
  }

  // --- MONEY REQUESTS ---
  createMoneyRequest(payload: { recipientAccountNumber: string; amount: number; memo?: string }) {
    return this.request<any>("/requests/money", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  getMyMoneyRequests() {
    return this.request<any[]>("/requests/money/me");
  }

  respondToMoneyRequest(requestId: string, action: "ACCEPT" | "REJECT") {
    return this.request<any>(`/requests/money/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  }

  cancelMoneyRequest(requestId: string) {
    return this.request<any>(`/requests/money/${requestId}/cancel`, {
      method: "POST",
    });
  }

  // --- LOANS ---
  createLoanDraft(payload: any) {
    return this.request<any>("/loans/draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  updateLoanDraft(loanId: string, payload: any) {
    return this.request<any>(`/loans/${loanId}/draft`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  getMyLoans() {
    return this.request<any[]>("/loans/me");
  }

  submitLoan(loanId: string) {
    return this.request<any>(`/loans/${loanId}/submit`, {
      method: "POST",
    });
  }

  // --- FIREWALL ---
  checkFirewall(payload: { text: string; context?: any }) {
    return this.request<any>("/firewall/check", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // --- AI CHAT ---
  sendChatMessage(payload: { message: string; conversationId?: string | null }) {
    return this.request<any>("/chat/message", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // --- NOTIFICATIONS ---
  getNotifications(page = 1, limit = 20) {
    return this.request<{ notifications: any[]; pagination: any }>(`/notifications?page=${page}&limit=${limit}`);
  }

  markNotificationAsRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  }

  markAllNotificationsAsRead() {
    return this.request<any>("/notifications/read-all", {
      method: "PATCH",
    });
  }

  // --- BANKER ---
  bankerGetCustomers(page = 1, limit = 20, search = "") {
    return this.request<any>(`/banker/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  }

  bankerGetSecurityEvents(page = 1, limit = 20, riskLevel = "") {
    const query = riskLevel ? `&riskLevel=${riskLevel}` : "";
    return this.request<any>(`/banker/security-events?page=${page}&limit=${limit}${query}`);
  }

  bankerIssueWarning(customerId: string, reason: string) {
    return this.request<any>(`/banker/customers/${customerId}/warnings`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  bankerGetOperationalRequests(status = "") {
    const query = status ? `?status=${status}` : "";
    return this.request<any[]>(`/banker/operational-requests${query}`);
  }

  bankerDecideOperationalRequest(requestId: string, decision: "APPROVE" | "REJECT", decisionReason = "") {
    return this.request<any>(`/banker/operational-requests/${requestId}/decision`, {
      method: "POST",
      body: JSON.stringify({ decision, decisionReason }),
    });
  }

  bankerSetRestriction(customerId: string, restriction: string, reason = "") {
    return this.request<any>(`/banker/customers/${customerId}/restrictions`, {
      method: "POST",
      body: JSON.stringify({ restriction, reason }),
    });
  }

  // --- MANAGER ---
  managerGetRegistrations() {
    return this.request<any[]>("/manager/registrations");
  }

  managerDecideRegistration(userId: string, decision: "APPROVE" | "REJECT", decisionReason = "") {
    return this.request<any>(`/manager/registrations/${userId}/decision`, {
      method: "POST",
      body: JSON.stringify({ decision, decisionReason }),
    });
  }

  managerGetLoans(status = "") {
    const query = status ? `?status=${status}` : "";
    return this.request<any[]>(`/manager/loans${query}`);
  }

  managerDecideLoan(loanId: string, decision: "APPROVE" | "REJECT", decisionReason = "") {
    return this.request<any>(`/manager/loans/${loanId}/decision`, {
      method: "POST",
      body: JSON.stringify({ decision, decisionReason }),
    });
  }

  managerGetUsers(role = "") {
    const query = role ? `?role=${role}` : "";
    return this.request<any[]>(`/manager/users${query}`);
  }

  managerGetBankers() {
    return this.request<any[]>("/manager/bankers");
  }

  managerGetSecurityOverview() {
    return this.request<any>("/manager/security-events");
  }
}

export const api = new ApiClient();
