# StromBreaker 2.0 — Blue-Team AI Firewall & Guardrail Defense

> **StromBreaker 2.0 is a security-focused, AI-powered banking application concept.** It combines a banking experience with a conversational assistant and a backend-enforced AI firewall designed to detect attempts to manipulate the assistant or bypass banking controls.

This repository currently contains **implementation prompts and design/asset references** for Antigravity, not a verified, ready-to-run full-stack application. The README distinguishes the files that exist in the prompt package from the application structure the backend prompt asks the implementation to create.

---

## Contents

- [Project Goals](#project-goals)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Target Application Architecture](#target-application-architecture)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Secure Transaction Lifecycle](#secure-transaction-lifecycle)
- [AI Firewall Workflow](#ai-firewall-workflow)
- [Security Principles](#security-principles)
- [Testing](#testing)
- [Frontend Design References](#frontend-design-references)
- [Troubleshooting](#troubleshooting)
- [Current Project Status](#current-project-status)

---

## Project Goals

StromBreaker 2.0 demonstrates how a conversational AI assistant can support banking workflows without making the language model the authority for financial actions.

The project has two main goals:

1. **AI-powered banking assistance:** allow authenticated users to ask about account information and supported banking operations in natural language.
2. **Blue-Team AI firewall:** inspect untrusted input, identify prompt injection and related attacks, enforce deterministic policies, and prevent untrusted model output from directly invoking privileged actions.

The main design rule is:

> **The LLM may interpret a request; the backend must enforce permissions, banking rules, confirmations, and state transitions.**

StromBreaker 2.0 is a prototype/demo project. It must not be connected to real customer funds or production banking systems without a separate professional security, privacy, compliance, and reliability review.

## Core Features

The prompts describe the following intended capabilities. A feature is not considered complete merely because it appears in a prompt or UI; it must be implemented, connected to the API, and tested.

### Customer experience
- Landing page and product feature sections.
- Registration and login.
- Customer dashboard with account information, balance, and transaction history.
- AI banking assistant.
- Transaction history and transfer preparation/confirmation screens.
- Money requests, notifications, and loan application workflows.

### Security and administration
- AI firewall assessment and security-event monitoring.
- Role-based customer, banker, and manager experiences.
- Audit logs for sensitive operations.
- Backend validation of account ownership, permissions, limits, and transaction state.
- Rate limiting, request validation, safe error handling, and sanitized logs.

---

## Technology Stack

![StromBreaker 2.0 Technology Stack](docs/images/StromBreaker 2.0-tech-stack.svg)

*High-level stack overview. Refer to the tables below for each technology's role.*

### Technology Badges

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/docs)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/docs/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs)
[![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/doc)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en)
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://learning.postman.com/)

---

### Backend — required by `backend/backendPromt.md`

| Technology | Purpose |
|---|---|
| JavaScript | Backend language |
| Node.js | JavaScript runtime |
| Express.js | HTTP server and API routing |
| MongoDB | Document database |
| Mongoose | MongoDB schemas, models, and queries |
| JWT | Authentication tokens |
| `bcrypt` or `bcryptjs` | Password hashing |
| Official LLM provider JavaScript SDK | Model calls and native tool/function calling |
| Zod or `express-validator` | Request validation |
| Jest | Automated tests |
| Supertest | HTTP/API integration tests |
| Postman or Thunder Client | Manual API testing |

The backend specification explicitly rules out a Python backend and Python-based LangChain implementation. Use CommonJS (`require` / `module.exports`) unless the actual project already consistently uses ES modules; do not mix module systems.

### Frontend — design prompt requirements

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type safety |
| Vite | Development server and build tooling (if creating a new frontend) |
| Tailwind CSS | Utility-first styling |
| React Router | Client-side navigation if used by the generated app |
| Additional component libraries | Install only when a chosen reference actually requires them |

The individual frontend references may use additional libraries for animation, 3D visuals, charts, or UI components. Inspect each file and install only the dependencies needed by the implementation. Keep the existing repository setup if it already meets the requirements.

### Design and development tools
- **Antigravity IDE:** intended to implement and integrate the code using the prompts.
- **Git and GitHub:** source control and collaboration.
- **Postman / Thunder Client:** API verification.
- **MongoDB local installation or MongoDB Atlas:** database for development.
- **21st.dev component references:** source material for frontend patterns and visual direction; follow the supplied Markdown specifications.

---

## Repository Structure

### Files in the current prompt-and-assets package

The current archive contains this structure (including the filenames as they exist in the archive):

```text
PromptWar/
├── README.md
├── backend/
│   └── backendPromt.md
└── frontend/
    ├── ai-assistant.md
    ├── banker-dashboard.md
    ├── dashboard.md
    ├── features.md
    ├── hero-section.zip
    ├── login.md
    ├── managerdashboard.md
    ├── navbar.md
    ├── notifications.md
    ├── register.md
    ├── security-dashboard.md
    ├── transaction.md
    └── transfer-confirmation.md
```

> **Important:** The names `backendPromt.md`, `managerdashboard.md`, and `transaction.md` are the names present in the supplied archive. Use the exact names unless you intentionally rename the files and update any references.

### What each prompt/reference does

| File | Responsibility |
|---|---|
| `backend/backendPromt.md` | Master backend specification: architecture, API modules, data models, middleware, AI firewall, environment configuration, and tests |
| `frontend/navbar.md` | Navigation and related component/design requirements |
| `frontend/features.md` | Landing-page feature section and product presentation |
| `frontend/login.md` | Login screen reference |
| `frontend/register.md` | Registration screen reference |
| `frontend/dashboard.md` | Customer dashboard reference |
| `frontend/ai-assistant.md` | Conversational banking assistant reference |
| `frontend/transaction.md` | Transactions/history screen reference |
| `frontend/transfer-confirmation.md` | Transfer review and confirmation experience |
| `frontend/security-dashboard.md` | Firewall/security monitoring screen |
| `frontend/banker-dashboard.md` | Banker-facing dashboard |
| `frontend/managerdashboard.md` | Manager-facing dashboard |
| `frontend/notifications.md` | Notifications experience |
| `frontend/hero-section.zip` | Supplied visual frames/assets intended for the landing-page hero animation |

The Markdown files are **implementation instructions and visual references**, not application source code. The hero ZIP is an asset archive, not a frontend package.

### Target backend structure requested by the backend prompt

Antigravity should implement the following structure (additional support files are acceptable when needed):

```text
StromBreaker 2.0/
├── server.js
├── package.json
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
│       └── StromBreaker 2.0.postman_collection.json
└── scripts/
    ├── seedAdmin.js
    └── seedDevelopmentData.js
```

### Target frontend structure

The supplied frontend references describe pages/components rather than a complete, verified Vite source tree. A reasonable implementation should create a conventional React/TypeScript frontend and keep design references separate from runtime code:

```text
frontend/
├── package.json
├── .env.example
├── index.html
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── assets/                 # extracted/optimized static assets as appropriate
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── routes/                 # route definitions and protected routes
    ├── components/             # shared UI, navigation, forms, dialogs
    ├── pages/                  # landing, auth, customer, security, banker, manager
    ├── features/               # transactions, AI assistant, loans, notifications
    ├── services/               # API client and endpoint functions
    ├── hooks/
    ├── types/
    ├── utils/
    └── styles/
```

This frontend tree is a **recommended implementation layout**, not a claim that these source files already exist in the prompt archive.

---

## Target Application Architecture

### HTTP/API flow

```text
React + TypeScript frontend
          |
          | HTTP / JSON
          v
Express routes (/api/v1)
          |
          v
Authentication + role authorization
          |
          v
Request validation + rate limiting
          |
          v
Controller
          |
          v
Service / banking business rules
          |
          v
Mongoose models
          |
          v
MongoDB
```

### AI assistant flow

```text
Authenticated user message
          |
          v
Input normalization
          |
          v
AI firewall assessment
          |
          v
Intent interpretation / structured tool proposal
          |
          v
Deterministic policy + authorization checks
          |
          +---- denied / suspicious ----> log event and stop
          |
          v
Prepare operation / request confirmation if required
          |
          v
Backend validates confirmation and current state
          |
          v
Execute authorized service operation
          |
          v
Persist result + audit event + response
```

The LLM should never receive unrestricted database access, execute arbitrary code, or be able to bypass server-side authorization by returning a favorable verdict.

---

## Requirements

Install these before implementing/running the generated application.

### Required development tools

1. **Git** — clone and manage the repository.
2. **Node.js LTS and npm** — run both the Express backend and React/Vite frontend. Use a currently supported Node.js LTS release compatible with the packages generated by Antigravity.
3. **MongoDB** — run a local development database, or create a MongoDB Atlas database and use its connection string.
4. **Antigravity IDE** — use the prompts to generate and integrate the code.
5. **Postman or Thunder Client** — test API endpoints.

Check your installations:

```bash
git --version
node --version
npm --version
```

If using a local MongoDB installation, verify that its service is running with the method appropriate to your operating system. If using Atlas, allow your development IP in Atlas network access settings and keep credentials private.

### Backend packages

The backend implementation should include packages for:
- `express`
- `mongoose`
- `jsonwebtoken`
- `bcrypt` or `bcryptjs`
- `zod` or `express-validator`
- the selected LLM provider's official JavaScript SDK
- environment variable loading (commonly `dotenv`)
- security middleware such as `helmet` and a rate limiter where appropriate
- development tooling such as `nodemon`
- testing with `jest` and `supertest`

The exact dependency versions should be selected and recorded in the generated `backend/package.json` (or root `package.json`, depending on the final repository layout). Prefer the dependencies in the generated package manifest over manually installing a second copy.

### Frontend packages

The frontend should include:
- `react` and `react-dom`
- `typescript`
- `vite`
- `tailwindcss` and the compatible Vite/Tailwind integration for the chosen Tailwind version
- `react-router-dom` if client-side routing is used
- `lucide-react` for icons used in the design references
- any additional packages required by selected components, such as animation, charts, or 3D effects

Do not install every possible library pre-emptively. Check the imports in the selected component references and the generated `package.json`.

---

## Installation and Setup

> The archive initially contains prompts and assets, not a confirmed working application. These steps describe how to prepare the project and how to run the application **after Antigravity has generated the source code and package manifests**.

### 1. Extract and open the repository

Extract the project archive, then open the `PromptWar` directory in Antigravity.

```bash
cd PromptWar
```

Inspect the repository before making changes:

```bash
git status
find . -maxdepth 3 -type f -not -path './.git/*' | sort
```

Do not remove `.git` or overwrite useful existing work simply to match a proposed folder tree.

### 2. Generate the application

1. Open `backend/backendPromt.md` and use it as the backend implementation specification.
2. Use each `frontend/*.md` file as the corresponding page/component reference.
3. Extract and inspect `frontend/hero-section.zip`; preserve the frame sequence and use the assets as intended.
4. Ask Antigravity to inspect the repository and current dependencies first.
5. Implement the frontend and backend, connect real API calls, and run the tests/builds.
6. Have Antigravity update this README with the **actual** package scripts, exact commands, API endpoints, and configuration created by the implementation.

Do not treat generated code as verified until the test and build commands pass.

### 3. Install backend dependencies

Run this from the directory that contains the generated backend `package.json`:

```bash
npm install
```

If the backend is in `backend/`, use:

```bash
cd backend
npm install
```

Do not run both alternatives blindly. Use the actual directory containing the backend `package.json`.

### 4. Install frontend dependencies

Open a second terminal and run this from the directory containing the generated frontend `package.json`:

```bash
cd frontend
npm install
```

If Antigravity creates a single root package manifest with workspaces, follow its scripts instead of treating frontend and backend as independent packages.

### 5. Configure MongoDB and environment variables

Create a local `.env` file from the backend `.env.example`:

```bash
cp .env.example .env
```

Run that command from the directory containing `.env.example`. If the file is in `backend/`, use `cd backend` first.

Edit `.env` and set the database URI, a strong JWT secret, the frontend origin, and the selected LLM provider settings. Never commit `.env`.

### 6. Start the backend

Use the scripts defined in the generated `package.json`. Common patterns are:

```bash
npm run dev
```

or:

```bash
npm start
```

These commands only work if the corresponding scripts are defined. The expected default backend URL in the backend prompt is:

```text
http://localhost:5000
```

The API prefix is:

```text
http://localhost:5000/api/v1
```

### 7. Start the frontend

In another terminal, from the frontend directory:

```bash
npm run dev
```

Vite commonly prints a local URL such as `http://localhost:5173`. Use the URL shown in the terminal, and configure the backend CORS allowlist to match it.

### 8. Verify the application

- Confirm the backend starts without configuration or database errors.
- Confirm the frontend compiles and loads.
- Test authentication and role restrictions.
- Verify that customer pages display backend data, not hardcoded demo values.
- Test transfer preparation and explicit confirmation.
- Test firewall behavior with both benign and suspicious inputs.
- Run automated tests and a production frontend build.

---

## Environment Variables

The backend specification gives this example configuration. The generated implementation may add variables; keep `.env.example` synchronized with the code.

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/StromBreaker 2.0
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
LLM_PROVIDER=replace_with_selected_provider
LLM_API_KEY=replace_with_provider_api_key
```

| Variable | Meaning |
|---|---|
| `PORT` | Port used by the Express server |
| `NODE_ENV` | Runtime environment such as `development` or `production` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign/verify JWTs; use a long, random value |
| `JWT_EXPIRES_IN` | Token lifetime supported by the token implementation |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS |
| `LLM_PROVIDER` | Identifier for the selected LLM provider |
| `LLM_API_KEY` | API key for that provider |

Generate a strong local secret rather than using the placeholder. For example, on Linux:

```bash
openssl rand -hex 32
```

Copy the output into your local `.env`. Never paste secrets into source files, prompts, screenshots, commits, or public issue trackers. Do not expose server-only variables in frontend variables. Vite variables prefixed with `VITE_` are available to browser code and must never contain secrets.

The frontend may use:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

This is a frontend configuration convention; ensure the generated API client reads it and the value matches the actual backend URL.

---

## Running the Application

Because the prompt archive does not include a verified application `package.json`, the exact command depends on how Antigravity implements the project. Once the source code is generated, the expected two-terminal workflow is:

**Terminal 1 — backend**

```bash
cd <directory-containing-backend-package.json>
npm install
npm run dev
```

**Terminal 2 — frontend**

```bash
cd <directory-containing-frontend-package.json>
npm install
npm run dev
```

Replace the directory placeholders with the real paths and use the scripts present in the corresponding `package.json`. If the project uses a root workspace, use the workspace commands defined there.

---

## API Overview

The shared API prefix specified by the backend prompt is:

```text
/api/v1
```

The backend prompt defines these API areas:

| Area | Intended responsibility |
|---|---|
| `/auth` | Registration, login, and authentication |
| `/accounts` | Current user's account and account information |
| `/transactions` | Transaction history and secure transfer workflow |
| `/requests` | Money requests |
| `/loans` | Loan application workflows |
| `/firewall` | Firewall assessment and security-related actions |
| `/chat` | AI assistant conversation requests |
| `/banker` | Banker-authorized operations |
| `/manager` | Manager-authorized operations |
| `/notifications` | User notifications |

These are **route groups**, not a guaranteed list of exact paths or HTTP methods. Consult the generated route files or Postman collection for the actual endpoint contract. The frontend should use the real API responses and display loading, empty, error, and success states accurately.

The backend prompt's standard response shape is:

**Success**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

**Failure**
```json
{
  "success": false,
  "message": "Request could not be completed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

Sensitive internal details, stack traces, tokens, password hashes, and raw database errors must not be returned to clients.

---

## Secure Transaction Lifecycle

Transfers must use a stateful, backend-controlled workflow. The intended lifecycle is:

1. **Prepare:** validate the authenticated user, recipient, amount, currency, and applicable rules. Preparation alone must not move money.
2. **Review:** show the user the server-verified transfer details.
3. **Confirm:** require an explicit user action tied to the prepared operation.
4. **Revalidate:** the backend checks authorization, current account state, limits, expiry, and whether the request has already been processed.
5. **Execute:** perform the authorized operation and persist the result.
6. **Audit:** record the relevant event and return the actual persisted result.
7. **Display:** show success only when the backend confirms success.

A firewall verdict of `APPROVE` means only that the assessed request passed the firewall policy. **It is not transaction authorization and is not proof that money moved.**

Use idempotency/deduplication protection for sensitive operations so retries cannot accidentally execute the same transfer twice. For financial amounts, use integer minor units (for INR, paise) in internal calculations rather than floating-point arithmetic.

---

## AI Firewall Workflow

The firewall is a defensive layer intended to identify and block attempts to manipulate the assistant or bypass application policy.

### Threats in scope
- Prompt injection and instructions that attempt to override system/developer policy.
- Jailbreak attempts and requests to disable guardrails.
- Obfuscated or transformed malicious instructions.
- Malicious instructions embedded in transaction descriptions/memos or other untrusted text.
- Attempts to call tools the current user is not authorized to use.
- Attempts to make the model invent or misrepresent financial outcomes.

### Intended processing
1. Normalize untrusted input.
2. Assess it with deterministic detectors and, where configured, model-assisted analysis.
3. Produce a validated structured assessment.
4. Apply the server-side policy engine and risk rules.
5. Deny or safely handle suspicious requests before privileged tools run.
6. Validate every proposed tool call against a narrow allowlist and the authenticated user's permissions.
7. Log security-relevant events without logging secrets or unnecessary sensitive data.
8. Validate model output before returning it to the client.

The exact detection strategy and verdict schema should be defined by the implemented firewall modules and tests. A language model classification alone is not a security boundary.

---

## Security Principles

- **Server-side authorization:** never rely on a hidden button or frontend role check as the security control.
- **Account ownership:** users can access only the accounts and records they are authorized to access.
- **Least privilege:** expose narrow tools with validated arguments; do not give the LLM unrestricted database access.
- **Explicit confirmation:** sensitive financial actions require a server-validated confirmation workflow.
- **No fabricated state:** do not invent balances, transaction statuses, loan decisions, security events, or successful outcomes.
- **Input validation:** validate every untrusted payload before business logic executes.
- **Rate limiting:** protect authentication, chat, and sensitive routes against abuse.
- **Safe errors and logs:** do not return stack traces or log secrets, tokens, passwords, or full sensitive payloads.
- **Secrets management:** keep `.env` out of version control and use separate secrets for deployed environments.
- **Auditability:** record meaningful sensitive actions and security decisions.
- **Fail safely:** if required policy checks, authorization, or validation fail, do not execute the privileged action.
- **Prototype scope:** use development/test data only; this project is not a production banking platform.

---

## Testing

The backend prompt requires Jest and Supertest. Once the application is generated, run the scripts defined in its `package.json`. Common patterns are:

```bash
npm test
```

For the frontend, run the production build script if it is defined:

```bash
npm run build
```

Check `package.json` first; these scripts must exist before the commands can work.

### Minimum verification checklist

- [ ] Backend environment validation catches missing configuration.
- [ ] MongoDB connection works and connection failures are handled safely.
- [ ] Registration and login work; passwords are hashed.
- [ ] JWT authentication rejects missing, invalid, or expired tokens.
- [ ] Role-protected routes reject unauthorized roles.
- [ ] Users cannot read or modify another user's account.
- [ ] Invalid amounts, recipients, and request payloads are rejected.
- [ ] Preparing a transfer does not move money.
- [ ] Confirmation revalidates the prepared operation.
- [ ] Retries do not execute the same operation twice.
- [ ] Suspicious firewall inputs are blocked before sensitive tools run.
- [ ] Benign banking requests remain usable.
- [ ] Model output and tool arguments are validated.
- [ ] Security and audit records are persisted where required.
- [ ] Frontend uses API responses rather than fabricated values.
- [ ] Loading, empty, failure, and success states are visible and accurate.
- [ ] Frontend production build passes.
- [ ] Tests pass and test results are reviewed before a demo.

Use only synthetic development data when testing. Never use real customer credentials or financial information.

---

## Frontend Design References

The frontend Markdown files provide design and implementation direction for individual screens. Use them as the source of truth for the relevant component, and preserve their intended visual details as closely as practical:

- Layout and component hierarchy.
- Typography, spacing, color, gradients, borders, and shadows.
- Hover, focus, loading, and responsive behavior.
- Animation and supplied hero frames.
- Accessibility and keyboard interaction.
- Integration with the actual API and application routing.

A design reference does not guarantee an exact match automatically. Compare the generated page against the instructions and correct deviations after implementation. If a reference imports a library, verify that the dependency is installed and compatible with the project's current versions.

---

## Troubleshooting

### `npm: command not found`
Install a supported Node.js LTS release, then open a new terminal and verify `node --version` and `npm --version`.

### Backend cannot connect to MongoDB
- Verify `MONGODB_URI` is correct.
- Start the local MongoDB service if using a local database.
- For Atlas, check credentials, network access, and the connection string.
- Check that environment variables are loaded before the database connection starts.

### Frontend requests fail with CORS errors
- Confirm the backend is running.
- Check `VITE_API_BASE_URL`.
- Set `CLIENT_ORIGIN` to the actual frontend origin shown by Vite.
- Ensure the backend CORS configuration permits that origin and the required methods/headers.

### LLM calls fail
- Confirm `LLM_PROVIDER` matches the provider integration in the generated code.
- Confirm the API key is present in the backend `.env`.
- Check provider availability, model access, quota, and network connectivity.
- Never move the provider API key into frontend code.

### A UI reference fails to compile
- Read the imports in that Markdown reference and identify missing dependencies.
- Confirm React, TypeScript, Tailwind, and related package versions are compatible.
- Check whether the reference expects a shadcn/ui component or a project-specific alias.
- Integrate the component into the existing app rather than blindly replacing the whole project.

### `npm run dev` or `npm test` is missing
Open the relevant `package.json` and inspect its `scripts`. Use an existing script or define the appropriate script as part of implementation; do not assume it exists.

---

## Current Project Status

**Status: implementation specification and design/asset package.**

The supplied archive contains the backend master prompt, frontend design references, and hero asset archive. It does not establish that the full application has already been implemented, configured, or tested.

After implementation, update this section with:
- Actual frontend and backend folder locations.
- Exact Node.js and package-manager versions used.
- Actual installation and startup commands.
- Required environment variables (without secret values).
- Implemented API endpoints and test commands.
- Completed features, known limitations, and verified test/build results.

Do not claim a feature is complete unless it has been implemented and verified.