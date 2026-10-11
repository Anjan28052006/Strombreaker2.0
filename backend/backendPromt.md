# BANKISM — Complete Backend Development Master Prompt

Act as a senior backend engineer, AI security engineer, and software architect. Build a complete, working backend for **Bankism: Blue-Team AI Firewall & Guardrail Defense**, a secure AI-powered banking application.

Do not merely generate boilerplate, sample snippets, or an architectural explanation. Inspect the existing repository, implement the application file by file, connect all modules, run tests, fix errors, and document how to run and verify the complete backend.

If the repository already contains code, inspect and preserve useful existing work. Do not overwrite working functionality unnecessarily.

---

# 1. Project Overview

Bankism is an AI-powered banking application in which customers interact with an assistant through natural language to perform banking-related tasks.

The application must demonstrate two major capabilities:

1. **AI-powered banking assistance:** Customers can ask questions about balances, transactions, transfers, money requests, deposits, withdrawals, and loan applications using conversational language.
2. **Blue-team AI firewall:** Untrusted inputs are analyzed before sensitive actions. The system must detect prompt injection, jailbreaks, policy overrides, malicious transaction memos, obfuscation, and unauthorized attempts to manipulate the AI into bypassing banking security.

The main security principle is:

**The LLM can interpret requests, but the backend must enforce every permission, financial rule, confirmation, and state transition.**

The LLM must never be the final authority for moving money, approving loans, changing account restrictions, or granting permissions.

---

# 2. Mandatory Technology Stack

Use only the following backend stack:

- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt or bcryptjs for password hashing
- An official LLM provider's JavaScript SDK with native tool/function calling
- Zod or express-validator for request validation
- Jest and Supertest for automated tests
- Postman or Thunder Client for manual API testing

Do not use Python, LangChain, or a Python-based backend.

Do not introduce unnecessary frameworks or services. Keep the implementation understandable, modular, testable, and suitable for a student team to maintain.

Use CommonJS (`require` and `module.exports`) unless the existing repository consistently uses ES modules. Do not mix module systems.

Use environment variables for secrets and configuration. Do not hardcode LLM API keys, JWT secrets, administrator passwords, or production credentials.

---

# 3. Required Folder Structure

Follow this structure and implement the functionality inside the appropriate files. You may add supporting files when genuinely necessary, but do not reorganize the project without a strong technical reason.

bankism/
├── server.js
├── package.json
├── .env
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── accounts.routes.js
│   │   ├── transactions.routes.js
│   │   ├── requests.routes.js
│   │   ├── loans.routes.js
│   │   ├── firewall.routes.js
│   │   ├── chat.routes.js
│   │   ├── banker.routes.js
│   │   ├── manager.routes.js
│   │   └── notifications.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── accounts.controller.js
│   │   ├── transactions.controller.js
│   │   ├── requests.controller.js
│   │   ├── loans.controller.js
│   │   ├── firewall.controller.js
│   │   ├── chat.controller.js
│   │   ├── banker.controller.js
│   │   ├── manager.controller.js
│   │   └── notifications.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── account.service.js
│   │   ├── transaction.service.js
│   │   ├── moneyRequest.service.js
│   │   ├── loan.service.js
│   │   ├── firewall.service.js
│   │   ├── chat.service.js
│   │   ├── banker.service.js
│   │   ├── manager.service.js
│   │   ├── notification.service.js
│   │   └── audit.service.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Transaction.js
│   │   ├── MoneyRequest.js
│   │   ├── LoanApplication.js
│   │   ├── Notification.js
│   │   ├── SecurityEvent.js
│   │   └── AuditLog.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── requireRole.js
│   │   ├── validateRequest.js
│   │   ├── rateLimiter.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── account.validator.js
│   │   ├── transaction.validator.js
│   │   ├── loan.validator.js
│   │   └── firewall.validator.js
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   ├── cors.js
│   │   └── constants.js
│   ├── firewall/
│   │   ├── inputNormalizer.js
│   │   ├── injectionDetector.js
│   │   ├── jailbreakDetector.js
│   │   ├── policyEngine.js
│   │   ├── riskScorer.js
│   │   ├── outputValidator.js
│   │   └── toolGuard.js
│   ├── security/
│   │   ├── password.js
│   │   ├── token.js
│   │   ├── idempotency.js
│   │   └── sanitizeLogs.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── generateReference.js
│   └── jobs/
│       ├── expireTransactions.js
│       └── expireMoneyRequests.js
├── docs/
│   └── postman/
│       └── Bankism.postman_collection.json
└── scripts/
    ├── seedAdmin.js
    └── seedDevelopmentData.js

All imports and exports must be consistent. Every referenced module must exist. Every mounted route must have an implemented controller and service. Do not leave empty files, fake success responses, TODO-only implementations, or unimplemented security-critical functions.

---

# 4. Architecture and Coding Standards

Use this request flow:

Client → Express route → authentication/authorization middleware → request validation → controller → service → Mongoose model/database → standardized response.

The AI workflow must use:

Authenticated message → input normalization → firewall assessment → intent extraction → deterministic validation → authorized service call → confirmation when required → backend execution → persisted result → response to customer.

Responsibilities:

- Routes define HTTP methods, paths, and middleware.
- Controllers parse requests and return responses.
- Services contain business rules and database operations.
- Models define database schemas and indexes.
- Middleware handles authentication, role authorization, validation, rate limiting, errors, and missing routes.
- Validators validate untrusted request payloads.
- Firewall modules classify suspicious input and guard AI tool execution.
- Security modules handle password hashing, tokens, idempotency, and safe logs.
- Jobs expire eligible pending workflows.
- Utility modules provide shared errors, responses, and reference generation.

Avoid circular imports, duplicated business logic, giant controllers, and repeated database connections.

Use a shared API prefix:

http://localhost:5000/api/v1

Use a consistent JSON response format, for example:

Success:
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}

Failure:
{
  "success": false,
  "message": "Request could not be completed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}

Do not expose stack traces, raw database errors, tokens, password hashes, internal prompts, or sensitive financial data to clients.

---

# 5. Database Configuration and Environment

Implement `src/config/db.js` with a single reusable MongoDB connection.

Implement `src/config/env.js` to validate required environment variables before the server starts.

Implement `src/config/cors.js` with a configurable allowlist for the frontend origin.

Implement `src/config/constants.js` with shared role, account status, transaction status, security verdict, risk level, and other enums.

Create `.env.example` containing placeholder values similar to:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/bankism
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
LLM_PROVIDER=replace_with_selected_provider
LLM_API_KEY=replace_with_provider_api_key
LLM_MODEL=replace_with_supported_model

Adjust provider-specific environment variables to the selected SDK.

Never commit `.env`. Add it, test secrets, logs, and generated private files to `.gitignore`.

The server must connect to MongoDB before accepting requests. If database initialization fails, fail safely and report a sanitized error.

Implement:

- GET `/health`

The health endpoint should report basic application status without revealing secrets, credentials, internal configuration, or detailed database connection information.

Set a reasonable JSON request body limit, configure CORS correctly, and mount error-handling middleware after application routes.

Use `npm run dev`, `npm start`, and `npm test` scripts.

---

# 6. Database Models

Implement all eight models using Mongoose, timestamps, validation, and appropriate indexes.

## User.js

Fields:

- `fullName`
- `email`: normalized, trimmed, unique
- `passwordHash`
- `role`: CUSTOMER, BANKER, MANAGER
- `accountStatus`: PENDING, ACTIVE, FROZEN, BLOCKED, REJECTED
- `maliciousAttemptCount`, default 0
- `warningCount`, default 0
- timestamps

Never return `passwordHash` in API responses.

Never allow public registration to assign the BANKER or MANAGER role.

## Account.js

Fields:

- `accountNumber`: unique, generated using a secure approach
- `userId`: User reference
- `accountType`
- `balancePaise`: non-negative integer
- `currency`: INR
- `status`: ACTIVE, FROZEN, CLOSED
- timestamps

Do not expose a customer API to set or edit balances.

## Transaction.js

Fields:

- `reference`: unique transaction reference
- `senderAccountId`
- `recipientAccountId`
- `amountPaise`: positive integer
- `memo`: optional length-limited untrusted text
- `status`: PREPARED, PENDING_REVIEW, PROCESSING, COMPLETED, FAILED, CANCELLED, EXPIRED
- `idempotencyKey`
- confirmation token hash/reference as required
- `confirmationExpiresAt`
- `confirmedAt`
- timestamps

## MoneyRequest.js

Fields:

- `requesterAccountId`
- `recipientAccountId`
- `amountPaise`
- `memo`
- `status`: PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED
- timestamps

## LoanApplication.js

Fields:

- `applicantUserId`
- `loanType`
- `requestedAmountPaise`
- `applicationDetails`
- `status`: DRAFT, PENDING, UNDER_REVIEW, APPROVED, REJECTED, NEEDS_INFORMATION
- `reviewedBy`
- `reviewedAt`
- `decisionReason`
- timestamps

## Notification.js

Fields:

- `recipientUserId`
- `type`
- `title`
- `message`
- `resourceType`
- `resourceId`
- `readAt`
- timestamps

## SecurityEvent.js

Fields:

- `userId`, where attributable
- `threatCategory`
- `riskLevel`: LOW, MEDIUM, HIGH, CRITICAL
- `verdict`
- `sanitizedEvidence`
- `actionTaken`
- timestamps

## AuditLog.js

Fields:

- `actorUserId`
- `action`
- `resourceType`
- `resourceId`
- `metadata`
- timestamps

Use appropriate indexes and unique constraints. Do not store raw confirmation tokens, passwords, JWTs, or unnecessary sensitive data in audit records.

---

# 7. Authentication and User Registration

Implement:

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/auth/me`

## Registration

Customers provide their name, email, and password.

- Normalize email.
- Validate all fields.
- Hash passwords using bcrypt or bcryptjs.
- Create the user with role CUSTOMER and accountStatus PENDING.
- Do not allow the request body to set role, account status, account number, or balance.
- Do not issue an active banking session to an unapproved customer.
- Prevent duplicate accounts and email registration races.

## Login

- Verify the password hash.
- Return a generic authentication error when credentials are invalid.
- Check accountStatus before granting banking access.
- PENDING, REJECTED, FROZEN, and BLOCKED customers must not gain unauthorized banking access.
- Issue JWTs only after the applicable checks succeed.
- Never return password hashes.

## Authentication middleware

`src/middleware/auth.js` must verify JWT signatures and expiry, and populate `req.user` using verified claims.

Never trust the user ID or role from the body, URL, or query string as proof of identity.

`src/middleware/requireRole.js` must enforce role permissions server-side.

The manager has no public signup endpoint. A private frontend URL is not a security boundary. A manager must be created through a controlled seed/administrative process and authenticated normally.

Use rate limiting for authentication and sensitive endpoints.

---

# 8. Account APIs

Implement:

- GET `/api/v1/accounts/me`
- GET `/api/v1/accounts/me/balance`
- GET `/api/v1/accounts/me/transactions`

Customers may access only their own permitted account information.

- Derive the user identity from `req.user`.
- Verify ownership in the service layer.
- Mask account numbers when full disclosure is unnecessary.
- Retrieve transaction history from persisted Transaction records.
- Use pagination where appropriate.
- Never trust a customer-supplied user ID to access another user's account.

---

# 9. Transfer and Transaction Workflows

Implement these endpoints:

- POST `/api/v1/transactions/prepare`
- POST `/api/v1/transactions/confirm`
- GET `/api/v1/transactions/me`
- GET `/api/v1/transactions/:transactionId`
- POST `/api/v1/transactions/:transactionId/cancel`
- POST `/api/v1/transactions/deposit-requests`
- POST `/api/v1/transactions/withdrawal-requests`
- GET `/api/v1/transactions/requests/me`

All sensitive endpoints require authentication and appropriate authorization.

## Monetary representation

Accept rupee amounts at the API boundary where convenient, validate their precision, and immediately convert them to integer paise.

All internal balance calculations and persisted amounts must use integer paise. Reject non-finite values, zero, negative amounts, excessive decimal precision, and amounts beyond configured limits.

Never use floating-point arithmetic to debit or credit balances.

## Transfer preparation

Example request:

{
  "recipientAccountNumber": "123456789012",
  "amount": 250,
  "memo": "Shared expenses",
  "idempotencyKey": "unique-operation-key"
}

The recipient account number is mandatory.

If it is missing, ask the customer to supply it. Do not guess an account number or resolve an ambiguous name into a recipient.

Before preparation:

1. Verify the authenticated sender.
2. Verify account ownership and active account status.
3. Verify the recipient account exists.
4. Verify recipient and user status.
5. Reject prohibited self-transfers.
6. Validate amount, available balance, and transfer limits.
7. Run the firewall and applicable deterministic security rules.
8. Create a PREPARED transaction without moving money.
9. Generate a short-lived confirmation token bound to the authenticated user and exact prepared transaction.

Return the transaction reference, verified recipient display name, masked account number, amount, memo, expiry, and a confirmation requirement.

Never debit or credit an account during preparation.

## Transfer confirmation

Require a transaction ID and backend-issued confirmation token/reference.

Before execution:

1. Verify the authenticated user owns the prepared transaction.
2. Verify the token is valid, unexpired, single-use, and bound to the exact transaction.
3. Verify recipient and amount are unchanged.
4. Recheck current account statuses, balance, limits, and security requirements.
5. Execute the debit and credit atomically.
6. Persist the completed transaction and required audit records.
7. Notify the relevant parties.
8. Return the actual database result.

MongoDB multi-document transactions require a replica-set-capable deployment. Provide clear instructions for local MongoDB replica-set setup.

Never fall back to separate debit and credit updates if atomic transactions are unavailable. A failed operation must not leave only one side updated.

Implement idempotency and concurrency protection so retries, duplicate confirmations, simultaneous requests, or network timeouts cannot result in double transfers.

A previously completed transaction must never be executed again.

## Transaction history and cancellation

Customers can view only transactions involving their own accounts.

Cancellation is allowed only for eligible pending transactions. Never cancel or reverse a completed transfer through an ordinary cancellation endpoint.

## Deposits and withdrawals

Deposit and withdrawal endpoints create banker-review requests.

They must not immediately change the account balance merely because the customer requested a deposit or withdrawal. A real balance change occurs only through a separately authorized, audited operation after the appropriate review.

---

# 10. Money Request Workflows

Implement:

- POST `/api/v1/requests/money`
- GET `/api/v1/requests/money/me`
- GET `/api/v1/requests/money/:requestId`
- POST `/api/v1/requests/money/:requestId/respond`
- POST `/api/v1/requests/money/:requestId/cancel`

A customer can request money from another customer.

- Require exact recipient account identification.
- Resolve the recipient safely.
- Confirm the request details with the requester before creating it.
- Notify the intended recipient.
- Only the recipient can accept or reject.
- Only the requester can cancel a pending request.
- Expire requests safely.
- Verify ownership on every endpoint.

Accepting a money request must NOT automatically debit the recipient. Acceptance starts a separate transfer preparation and explicit confirmation process.

---

# 11. Loan Application Workflows

Implement:

- POST `/api/v1/loans/draft`
- PATCH `/api/v1/loans/:loanId/draft`
- GET `/api/v1/loans/me`
- GET `/api/v1/loans/:loanId`
- POST `/api/v1/loans/:loanId/submit`

The AI should gather missing details conversationally and save an incomplete draft when appropriate.

- Verify applicant ownership.
- Validate loan type, requested amount, and application details.
- Permit edits only while the application is in an eligible state.
- Show the application summary before submission.
- Require explicit confirmation before submitting.
- Set the application to the agreed pending review status.
- Notify the manager.
- Never automatically approve a loan because the AI thinks the customer qualifies.
- Never fabricate a decision.

The manager endpoints will handle approval and rejection.

---

# 12. AI Chat Service

Implement:

- POST `/api/v1/chat/message`
- `src/services/chat.service.js`
- `src/controllers/chat.controller.js`
- `src/routes/chat.routes.js`

Use the selected LLM provider's official JavaScript SDK and native tool/function calling. Configure the provider through environment variables.

The chat endpoint should accept a request similar to:

{
  "message": "What is my account balance?",
  "conversationId": null
}

The backend must derive the authenticated identity from `req.user`.

The assistant should respond naturally, remember the active workflow context as appropriate, ask follow-up questions, and explain outcomes clearly.

It must not invent:

- Balances
- Recipient identities
- Account numbers
- Transaction status
- Loan approval
- Notification delivery
- Banking operation results

All factual banking answers must come from actual backend services and persisted data.

## Approved tool functions

Create narrow, explicitly defined server-side tool wrappers such as:

- `get_balance`
- `get_transaction_history`
- `get_transaction_status`
- `resolve_recipient`
- `prepare_transfer`
- `execute_confirmed_transfer`
- `create_money_request`
- `submit_deposit_request`
- `submit_withdrawal_request`
- `prepare_loan_application`
- `submit_loan_application`
- `get_notifications`

Each tool must validate its arguments and enforce authorization and business rules.

Do not allow the model to run arbitrary MongoDB queries, arbitrary HTTP requests, shell commands, dynamic code, or unrestricted functions.

Do not expose an unrestricted transfer execution function to the model. The execution wrapper must require a valid backend-issued confirmation tied to the authenticated user and prepared transaction.

## Transfer conversation example

Customer: "Transfer ₹500 to Priya."

Assistant: If the recipient's exact account number is not available or the identity is ambiguous, ask for it.

Customer: supplies account number.

Assistant: The system validates the recipient, runs the firewall, prepares the transfer, and presents the verified recipient, masked account number, amount, and memo.

Assistant: Ask the customer to explicitly confirm or cancel.

Customer: Confirms using the application's confirmation flow.

Backend: Verifies the confirmation token and transaction state, rechecks rules, and executes the transfer atomically.

Assistant: Reports the actual persisted result.

Never interpret a general "yes" as authorization for a different, expired, or modified transaction.

The frontend may display a confirmation button, but the backend must enforce the confirmation independently.

---

# 13. AI Firewall and Prompt-Injection Defense

Implement:

- POST `/api/v1/firewall/check`
- `src/services/firewall.service.js`
- `src/controllers/firewall.controller.js`
- `src/routes/firewall.routes.js`
- `src/validators/firewall.validator.js`
- All seven modules under `src/firewall/`

Required modules:

### inputNormalizer.js

Normalize and length-limit incoming text. Handle suspicious Unicode, whitespace, and basic obfuscation carefully without destroying legitimate banking instructions.

### injectionDetector.js

Detect attempts to override system instructions, reveal hidden prompts, bypass security, manipulate tool selection, or treat untrusted content as privileged instructions.

### jailbreakDetector.js

Detect attempts to disable safeguards, adopt unrestricted roles, ignore previous policies, or bypass banking restrictions.

### policyEngine.js

Define deterministic policy for allowed, restricted, and forbidden actions. Combine deterministic rules with the structured classifier result.

### riskScorer.js

Assign LOW, MEDIUM, HIGH, or CRITICAL risk based on the threat category, evidence, action sensitivity, and policy.

### outputValidator.js

Validate all LLM firewall output against a strict schema. Reject malformed or unexpected output.

### toolGuard.js

Ensure tool calls are permitted for the authenticated user, current workflow, risk level, and requested action.

## Threat categories

Use consistent values:

- PROMPT_INJECTION
- JAILBREAK
- POLICY_OVERRIDE
- MEMO_INJECTION
- OBFUSCATION
- UNAUTHORIZED_ACCESS
- NONE

## Verdicts

Use:

- APPROVE
- BLOCK

Example response:

{
  "verdict": "BLOCK",
  "risk_level": "HIGH",
  "threat_category": "POLICY_OVERRIDE",
  "rationale": "The request attempts to override banking security rules.",
  "intent": "transfer",
  "requires_confirmation": true,
  "permitted_action": null
}

Use the same field names and enums throughout the application.

**An APPROVE verdict is not transaction authorization.** It only allows the request to proceed to ordinary validation. Authentication, role permissions, account ownership, balances, transaction limits, and explicit confirmation remain mandatory.

Treat transaction memos and quoted or externally supplied text as untrusted input. A memo must never change the system prompt, authorize a tool, or override the policy engine.

Do not depend solely on an LLM classifier. Combine deterministic checks, structured LLM output, schema validation, and a conservative policy engine.

If the provider times out, returns malformed output, or is unavailable, fail closed for privileged financial actions. Return a safe, understandable error. Do not increment a user's malicious-attempt count solely because of a provider outage or internal technical failure.

A blocked request must not execute a banking tool.

Store a sanitized SecurityEvent when a genuine suspicious attempt is detected. Record the threat category, risk level, verdict, action taken, and necessary evidence without storing credentials or unnecessary sensitive information.

Do not claim perfect prompt-injection detection.

---

# 14. Banker APIs and Responsibilities

Implement:

- GET `/api/v1/banker/customers`
- GET `/api/v1/banker/customers/:accountNumber`
- GET `/api/v1/banker/security-events`
- GET `/api/v1/banker/customers/:customerId/security-events`
- POST `/api/v1/banker/customers/:customerId/warnings`
- GET `/api/v1/banker/operational-requests`
- POST `/api/v1/banker/operational-requests/:requestId/decision`
- POST `/api/v1/banker/customers/:customerId/restrictions`

Require authenticated BANKER or another explicitly authorized role.

Bankers can:

- Search permitted customer/account information.
- Review security events.
- Issue warnings.
- Review deposit and withdrawal requests.
- Make authorized operational decisions.
- Apply permitted restrictions to customers.

Track qualifying malicious attempts and flag accounts for banker review when the configured threshold is exceeded. The intended default review threshold is more than three qualifying malicious attempts.

Do not permanently block customers automatically based only on an LLM verdict. Banker restrictions must follow explicit backend authorization and be recorded in the audit log.

Account restrictions must be enforced by banking services, not merely displayed in the UI.

---

# 15. Manager APIs and Responsibilities

Implement:

- GET `/api/v1/manager/registrations`
- POST `/api/v1/manager/registrations/:userId/decision`
- GET `/api/v1/manager/loans`
- POST `/api/v1/manager/loans/:loanId/decision`
- GET `/api/v1/manager/users`
- GET `/api/v1/manager/bankers`
- GET `/api/v1/manager/security-events`

Only authenticated MANAGER users may access these endpoints.

Managers can:

- Approve or reject pending customer registrations.
- Review and decide loan applications.
- View authorized user and banker information.
- Review security events.

For every decision:

- Validate the current status.
- Prevent conflicting or repeated decisions.
- Record the reviewer identity, decision time, reason, and relevant audit entry.
- Notify the affected customer.
- Enforce the state transition in the backend.

Registration approval must create or activate the associated account through a controlled, idempotent onboarding flow. Ensure an account cannot be created twice by retries.

Do not create a public manager signup endpoint.

---

# 16. Notification System

Implement:

- GET `/api/v1/notifications`
- PATCH `/api/v1/notifications/:notificationId/read`
- `src/services/notification.service.js`
- `src/controllers/notifications.controller.js`
- `src/routes/notifications.routes.js`

Support notifications for:

- Customer registration decisions.
- Banker warnings and restrictions.
- Suspicious security events.
- Money requests.
- Transfer preparation/results where appropriate.
- Deposit and withdrawal requests.
- Loan submissions and loan decisions.

Every notification must belong to a specific recipient user. Users may view and mark as read only their own notifications.

Use pagination. Validate resource references. Do not reveal another user's notifications or sensitive account data.

Create reusable notification functions that other services can call. Do not duplicate notification creation logic in every controller.

Persist notifications in MongoDB. Do not claim a notification was sent unless the relevant operation actually succeeded.

---

# 17. Audit Logging

Implement `src/services/audit.service.js` using the shared AuditLog model.

Record security-relevant operations such as:

- Transfer preparation, confirmation, cancellation, and completion.
- Banker restrictions and warnings.
- Registration decisions.
- Loan decisions.
- Deposit/withdrawal review decisions.
- Significant firewall events.

Audit logs must be sanitized and must not include passwords, JWTs, API keys, raw confirmation tokens, or unnecessary sensitive personal/financial information.

Ensure important audit records are persisted as part of the appropriate workflow. Where a transaction and its audit record must succeed together, use the same database transaction where practical.

---

# 18. Middleware, Validators, and Security Utilities

Implement the following reusable modules.

## validateRequest.js

Run schema validation before controllers. Return structured 400 errors for invalid requests.

## rateLimiter.js

Apply suitable rate limits to login, registration, firewall, chat, and sensitive banking operations. Avoid overly permissive limits on authentication.

## errorHandler.js and notFound.js

Return consistent error responses and do not expose internal exceptions to clients.

## password.js

Hash and verify passwords securely.

## token.js

Generate and verify signed, expiring JWTs.

## idempotency.js

Support safe retries of financial operations without duplicate execution.

## sanitizeLogs.js

Redact secrets and sensitive fields from logs. Coordinate use across the application rather than implementing inconsistent sanitizers.

## ApiError.js, ApiResponse.js, asyncHandler.js

Provide shared error, response, and asynchronous error-handling utilities.

## generateReference.js

Generate unique transaction and operational references using a secure, collision-resistant approach appropriate to their use.

Use request validators for authentication, account operations, transactions, loans, and firewall requests.

Do not trust user-supplied MongoDB operators, raw update objects, arbitrary sort expressions, or unrestricted filters.

---

# 19. Background Jobs

Implement:

- `src/jobs/expireTransactions.js`
- `src/jobs/expireMoneyRequests.js`

Jobs should safely expire eligible PREPARED transactions and PENDING money requests.

Requirements:

- Start each job only once from the application bootstrap.
- Do not start timers inside controllers or services that run on every request.
- Do not expire completed transactions.
- Do not overwrite an already-decided money request.
- Make state transitions conditional and concurrency-safe.
- Record appropriate audit information when required.
- Document how jobs run in local development and how multi-instance deployments should avoid duplicate job execution.

A job must never transfer money or execute a pending operation just because its expiry time has arrived.

---

# 20. Seed Scripts and Development Setup

Implement:

## scripts/seedAdmin.js

Create the initial manager through a controlled administrative process.

- Read credentials from secure environment configuration or a safe interactive mechanism.
- Hash the password.
- Do not hardcode credentials.
- Do not expose the operation through a public API.
- Avoid accidentally modifying an existing production manager.

## scripts/seedDevelopmentData.js

Create deterministic development-only customers, bankers, managers where appropriate, and accounts for testing.

- Do not run automatically in production.
- Make repeated runs safe and idempotent.
- Use fake customer information.
- Never store passwords in plain text.
- Never use a public endpoint to alter account balances.

Document how to seed data and obtain development login credentials safely.

---

# 21. Testing Requirements

Use Jest and Supertest with a separate test database. Mock the LLM provider for deterministic automated tests. Live provider tests may be optional and separately configured.

Implement tests covering:

## Authentication
- Registration validation.
- Duplicate email.
- Password hashing.
- Login success and failure.
- Pending, frozen, blocked, and rejected users.
- JWT expiry and invalid signatures.
- Role authorization.

## Accounts
- Customer ownership.
- Balance privacy.
- Transaction history ownership.
- Invalid account access.

## Transactions
- Missing recipient account number.
- Unknown recipient.
- Invalid amount.
- Insufficient balance.
- Frozen sender or recipient.
- Confirmation mismatch and expiry.
- Confirmation reuse.
- Duplicate idempotency key.
- Concurrent confirmation.
- Atomic debit and credit.
- No partial financial updates after failure.
- Transaction history privacy.

## Money requests and loans
- Request ownership.
- Recipient-only response.
- Requester-only cancellation.
- Accepting a money request does not automatically debit funds.
- Draft ownership.
- Submission confirmation.
- Invalid loan state transitions.
- Manager decision authorization.

## Firewall and AI
- Benign banking request.
- Prompt injection.
- Jailbreak.
- Policy override.
- Malicious memo.
- Obfuscation.
- Unauthorized access attempts.
- Malformed LLM output.
- LLM provider timeout.
- No tool execution after a BLOCK verdict.
- APPROVE never bypasses backend validation.
- Missing transfer account number leads to a follow-up.
- AI never fabricates banking results.
- Confirmation is tied to the correct pending operation.

## Banker, manager, notifications, and audit
- Unauthorized roles cannot access protected routes.
- Registration and loan decisions are validated.
- Banker restrictions are audited.
- Notification ownership.
- Security-event creation.
- Audit entries for important state changes.

Do not merely report that tests pass. Execute the test suite and fix failures before claiming success. If an integration test requires a MongoDB replica set, document the requirement and run it when the environment supports it.

---

# 22. Postman Collection

Create `docs/postman/Bankism.postman_collection.json`.

Include requests for:

- Health check.
- Registration and login.
- Authenticated account and balance access.
- Transaction preparation and confirmation.
- Transaction history and cancellation.
- Deposit and withdrawal requests.
- Money requests and responses.
- Loan drafts and submissions.
- Firewall checks.
- Chat messages.
- Banker endpoints.
- Manager endpoints.
- Notifications.

Configure reusable variables for `baseUrl`, tokens, test account numbers, transaction IDs, and other IDs.

Never include real secrets in the collection.

Document the order in which requests should be executed and how to seed the required development data.

---

# 23. README Documentation

Create a complete README explaining:

1. Project overview.
2. Features.
3. Architecture and folder responsibilities.
4. Prerequisites.
5. Installation commands.
6. Environment setup.
7. MongoDB setup, including replica-set requirements for atomic transfers.
8. LLM provider configuration.
9. Development seeding.
10. Running the server.
11. Running automated tests.
12. Testing APIs with Postman.
13. Authentication and role permissions.
14. Firewall verdicts and threat categories.
15. Transfer preparation and confirmation.
16. API endpoint reference.
17. Known limitations and security assumptions.

Provide commands that work on a typical Windows or Linux development setup where possible.

---

# 24. Development Execution Plan

Follow this order:

### Phase 1 — Inspect

Inspect the current repository, package.json, existing code, and configuration. Identify existing implementations and dependencies before changing files.

### Phase 2 — Foundation

Set up configuration, database connection, constants, models, shared errors, middleware, authentication, and account services.

### Phase 3 — Banking operations

Implement transfer preparation and confirmation, atomic transaction logic, deposit/withdrawal requests, money requests, and loan workflows.

### Phase 4 — Security engine

Implement input normalization, deterministic threat detection, risk scoring, policy enforcement, LLM output validation, tool guarding, security events, and audit logging.

### Phase 5 — AI chat

Implement provider integration, validated tool calling, safe conversation workflows, and follow-up handling.

### Phase 6 — Banker, manager, and notifications

Implement role-protected review endpoints, decisions, warnings, restrictions, notifications, and account onboarding.

### Phase 7 — Integration

Mount every route, check imports and exports, resolve circular dependencies, verify shared enums, and test every workflow.

### Phase 8 — Verification

Run automated tests, fix failures, run the server, test endpoints, and update the Postman collection and README.

Do not stop after generating the first few files. Continue until the backend is integrated or clearly report the exact environmental blocker preventing completion.

If you are working in an IDE with file-editing and terminal access, create and edit the actual project files, execute commands, and inspect their output. If you cannot run a command or access a dependency, report that limitation rather than claiming it succeeded.

---

# 25. Final Acceptance Criteria

The backend is ready for demonstration only when all of the following are true:

1. The server starts with valid configuration and connects to MongoDB.
2. Registration and login work with hashed passwords and proper account-status checks.
3. JWT authentication and role authorization protect the relevant endpoints.
4. Account and transaction information is isolated by ownership.
5. A transfer requires an exact recipient account number.
6. Preparing a transfer does not move money.
7. A transfer requires explicit, backend-verified confirmation.
8. Transfer debit and credit are atomic, with idempotency and concurrency protection.
9. Deposit and withdrawal requests follow the review workflow.
10. Money requests never automatically debit another customer.
11. Loan submissions require confirmation and manager review.
12. The firewall blocks detected prohibited requests before sensitive tools execute.
13. Firewall approval never bypasses business rules or authentication.
14. LLM failures do not cause unsafe financial execution or false malicious-attempt penalties.
15. Banker and manager APIs enforce roles and audit decisions.
16. Notifications are private to their intended recipients.
17. Audit logs and security events are sanitized.
18. Background expiration jobs do not alter completed operations.
19. The Postman collection covers the main workflows.
20. The README explains setup, configuration, tests, and limitations.
21. Automated tests have actually been run, with failures fixed or explicitly documented.
22. No secrets, fake banking results, placeholder success handlers, or unsafe direct-balance APIs remain.

Start by inspecting the repository and identifying the current state. Then implement the backend in the required order. Prioritize correctness, security, and end-to-end integration over generating a large amount of disconnected code.