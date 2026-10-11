# BANKISM — Frontend and Backend Integration Contract

## 1. Project Architecture

BANKISM is an AI-powered banking application with a Blue-Team AI Firewall.

Frontend:
- React
- TypeScript
- Tailwind CSS
- Existing shadcn/ui components where appropriate
- React Router where appropriate
- Framer Motion for restrained animations
- Lucide React for icons

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Zod or express-validator
- Official JavaScript SDK for the selected LLM provider

The backend is the authoritative source for all financial and security decisions.

## 2. API Configuration

Local API base URL:

http://localhost:5000/api/v1

Configure the API base URL through a frontend environment variable.

For Vite, use:

VITE_API_BASE_URL=http://localhost:5000/api/v1

Provide a `.env.example` file.

Do not expose JWT signing secrets, LLM API keys, database credentials,
or other backend secrets through frontend environment variables.

Only public frontend configuration may use VITE_ variables.

## 3. Authentication

Use the backend endpoints:

POST /auth/register
POST /auth/login
GET /auth/me

Registration must respect the backend's registration and approval workflow.

Do not automatically grant access to an account awaiting approval.

Implement:
- Form validation.
- Loading states.
- Useful validation errors.
- Authentication failure handling.
- Protected routes.
- Role-aware navigation.
- Session expiration handling.
- Logout.
- Redirects appropriate to the authenticated user's role.

Never trust a role supplied by the browser as authorization.

The backend must verify the user's identity and role on every protected request.

Follow the backend's implemented token/session strategy. Do not invent a
different authentication mechanism without checking the backend.

## 4. Customer Dashboard

Use the backend's actual account data.

Relevant endpoints include:

GET /accounts/me
GET /accounts/me/balance
GET /accounts/me/transactions

Display:
- Account information.
- Available balance, where supported.
- Recent transactions.
- Relevant transaction summaries.

Do not invent balances, account numbers, transactions, or financial statistics.

Format INR consistently.

Use integer paise or the backend's documented monetary representation
for calculations.

## 5. Transactions

Use:

GET /accounts/me/transactions
GET /transactions/me
GET /transactions/:transactionId

Use additional transaction endpoints only when they are implemented
and documented by the backend.

Display transaction information returned by the API.

Implement loading, error, empty, and populated states.

Do not calculate a successful transaction status from the UI alone.

## 6. Transfer Workflow

Use:

POST /transactions/prepare
POST /transactions/confirm
POST /transactions/:transactionId/cancel

Follow the actual request and response schemas defined by the backend.

The workflow is:

1. Collect the recipient and amount.
2. Validate user input.
3. Ask the backend to prepare the transfer.
4. Display the recipient, masked account number, amount, memo,
   expiry, and other verified details returned by the backend.
5. Ask the user for explicit confirmation.
6. Submit the confirmation request to the backend.
7. Display success only after receiving an authoritative successful result.
8. Refresh account and transaction data after completion.

Preparing a transfer must not move money.

Do not execute a transfer merely because the LLM recommends it.

Do not treat a firewall APPROVE verdict as transaction authorization.

Do not retry a potentially completed financial operation blindly.
Respect the backend's idempotency mechanism.

Do not hardcode demonstration amounts or recipients in real transaction flows.

Use INR formatting.

## 7. AI Assistant

Use:

POST /chat/message

Implement a conversational interface that:
- Accepts user messages.
- Displays assistant responses.
- Shows loading and error states.
- Renders supported action or confirmation states.
- Uses backend-provided action and transaction details.
- Avoids fabricating banking results.

Do not implement real banking operations entirely in the frontend.

The LLM may interpret a request, but the backend validates permissions,
financial rules, recipients, confirmation requirements, and state transitions.

Treat assistant output as untrusted data.

Never execute arbitrary code or unrestricted browser actions from LLM output.

## 8. Firewall and Security Dashboard

Use:

POST /firewall/check
GET /banker/security-events
GET /manager/security-events

Use the relevant endpoint only for a role authorized by the backend.

Render security verdicts, risk levels, timestamps, and event details
from real API responses.

Do not hardcode security event counts, risk scores, blocked attacks,
or threat statistics.

Do not expose sensitive internal prompts, credentials, private account
data, or confidential security implementation details to customers.

The frontend may display security information but must not make the
authoritative security decision.

## 9. Notifications

Use:

GET /notifications
PATCH /notifications/:notificationId/read

Render notifications from the backend.

Support loading, empty, error, unread, and read states.

Update the interface based on the backend's response.

Do not mark a notification as read locally if the server rejected the operation.

## 10. Banker Operations

Use the endpoints documented in the backend prompt for:
- Customer lookup.
- Customer security events.
- Operational requests.
- Request decisions.
- Customer warnings.
- Customer restrictions.

Implement role-aware pages and explicit confirmation for consequential actions.

Display only the data the current user is authorized to access.

Do not treat frontend route protection as sufficient authorization.

## 11. Manager Operations

Use the endpoints documented in the backend prompt for:
- Pending registrations.
- Registration decisions.
- Loan applications and decisions.
- User management.
- Banker management.
- Security events.

Require confirmation for consequential administrative actions.

Use the backend's actual decision states and response schemas.

Never simulate an approval or rejection locally and present it as persisted.

## 12. Shared API Client

Implement one reusable API client.

It should provide:
- Base URL configuration.
- Consistent JSON handling.
- Authentication/session handling.
- Error normalization.
- Appropriate request headers.
- Request timeouts where suitable.
- Consistent handling of 401, 403, 404, 409, 422, and 500 responses.

Do not duplicate raw fetch logic across every component.

Do not log tokens, passwords, secret keys, or sensitive financial payloads.

Do not silently convert failed API calls into fabricated successful results.

## 13. User Interface Requirements

All pages must share a coherent BANKISM design system.

Implement:
- Responsive layouts.
- Accessible form labels.
- Keyboard-accessible dialogs.
- Clear focus states.
- Loading indicators.
- Error messages.
- Empty states.
- Disabled states.
- Success feedback based on actual backend results.
- Confirmation dialogs for consequential actions.

Preserve the supplied design references while adapting them into one application.

## 14. Environment and CORS

Configure the backend's CORS allowlist to accept the actual frontend origin.

Local frontend:
http://localhost:5173

Local backend:
http://localhost:5000

Read the backend prompt for its environment variable requirements.

Never solve CORS errors by allowing every origin indiscriminately in production.

## 15. Integration Verification

Verify that:
- Registration and login call the backend.
- Protected pages handle unauthenticated users.
- Role-based pages handle forbidden responses.
- Customer balances come from the API.
- Transaction history comes from the API.
- Transfers follow preparation and explicit confirmation.
- Success screens appear only after backend-confirmed success.
- The AI assistant calls the backend.
- Security dashboards display real backend responses.
- Notifications use the documented endpoints.
- Banker and manager actions are authorized by the backend.
- Network and server failures produce useful UI feedback.

Do not invent endpoints or response fields.

If an endpoint or response schema is missing, inspect the backend implementation
and backend prompt. Resolve the integration consistently, then document the result.



