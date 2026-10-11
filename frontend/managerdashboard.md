# MASTER PROMPT — BANKISM ANIMATED BANKING DASHBOARD

Act as a world-class senior UI/UX designer, React architect, financial dashboard specialist, and motion-design engineer. Build a complete, production-quality, fully responsive banking dashboard for **BANKISM — AI-Powered Banking Security & Intelligent Financial Management**.

Use the attached reference image as the primary visual inspiration. Recreate its clean financial dashboard layout, rounded cards, elegant white surfaces, emerald-green highlights, organized sidebar, financial summaries, wallet cards, interactive charts, and transaction history. Upgrade the design with premium animations, polished micro-interactions, modern typography, and intelligent security visualizations.

**IMPORTANT: Do not build a static mockup. Build a working, interactive, animated web application with real UI state, functional navigation, meaningful interactions, and reusable components.**

## 1. TECH STACK AND PROJECT RULES

Use the following technologies:

- React with TypeScript.
- Vite if the existing project uses Vite; preserve the current framework if the project is already configured.
- Tailwind CSS for styling.
- shadcn/ui for reusable UI components.
- Framer Motion or Motion for React for advanced animations.
- Lucide React for consistent icons.
- Recharts for financial charts.
- React Router if routing is needed and is not already configured.
- React Hook Form and Zod for forms and validation where appropriate.

Before writing code, inspect the existing repository, understand the folder structure, package manager, installed dependencies, existing components, and current routing.

Do not overwrite or delete working code unnecessarily. Reuse existing dependencies and project conventions. Install only missing dependencies. Ensure that the final project compiles and runs.

## 2. DESIGN DIRECTION

Create a premium fintech interface inspired by modern digital banking platforms.

**Visual style:**
- Primary color: deep emerald green (#087443).
- Secondary accent: fresh mint green (#DDF5E9).
- Background: soft cool gray (#F1F3F4).
- Main content surfaces: white (#FFFFFF).
- Text: near-black (#15191B).
- Secondary text: muted gray (#6B7280).
- Positive indicators: emerald green.
- Warning indicators: amber.
- Critical security indicators: restrained red.
- Borders: subtle neutral gray.
- Typography: Inter or a similar modern sans-serif.
- Border radius: approximately 14–20px for dashboard cards.
- Use subtle shadows, fine borders, generous whitespace, and consistent spacing.

The overall experience should feel trustworthy, sophisticated, clean, secure, and premium.

Avoid excessive gradients, oversized headings, excessive glassmorphism, neon colors, clutter, and distracting animations. Use gradients sparingly for the primary balance card and selected interactive highlights.

## 3. APPLICATION LAYOUT

Build a complete dashboard shell with three major regions:

### A. Left sidebar

Create a fixed or sticky white sidebar with:

- BANKISM logo and custom geometric security emblem.
- Compact search input with keyboard shortcut indicator.
- Main Menu:
  - Dashboard
  - Analytics
  - Transactions
  - Accounts
  - Transfers
  - Beneficiaries
  - Cards
  - Bills & Payments
- Security Center:
  - AI Firewall
  - Threat Detection
  - Security Logs
  - Risk Analytics
- Additional:
  - Recurring Payments
  - Notifications
  - Settings
  - Help & Support
  - Logout

Each item should have a Lucide icon, smooth hover background, animated active indicator, and intuitive navigation.

Selected navigation items should use a dark emerald background or a restrained emerald accent, depending on the available space.

Animate sidebar items into view with subtle staggered motion on the initial page load.

Add a compact user profile area at the bottom containing an avatar, display name, account role, and dropdown menu.

On mobile, transform the sidebar into an accessible slide-out drawer with a backdrop and animated open/close transitions.

### B. Top navigation bar

Create a clean horizontal top bar with:

- Sidebar toggle for responsive layouts.
- Breadcrumb navigation.
- Global search.
- Help button.
- Messages button.
- Notifications bell with unread indicator.
- Profile avatar and dropdown.
- A prominent emerald-green “Secure Session” status indicator.
- Optional quick-action button.

Add polished hover states, tooltips, dropdown animations, and keyboard accessibility.

Notification dropdowns should display realistic example events, including a successful payment, a flagged transaction, and a new security alert.

### C. Main dashboard content

Build a responsive, grid-based dashboard that matches the visual hierarchy of the reference image.

At the top, display:

**Heading:** Overview

**Subtitle:** Monitor your finances, transactions, and AI-powered banking security in one place.

Include a date-range selector with Today, This Week, This Month, This Quarter, and Custom Range options.

Include a functional Reset Filters button that resets the applicable dashboard filters.

## 4. ANIMATED FINANCIAL SUMMARY CARDS

Create three prominent financial summary cards across the first content row.

### Card 1 — Total Balance

- Label: Total Balance.
- Example balance: ₹20,52,032.40.
- Monthly percentage change.
- Wallet or bank icon.
- Small trend indicator.
- “View Details” action.
- Emerald-green gradient background with white typography.

### Card 2 — Savings Account

- Example balance: ₹15,80,045.00.
- Savings account icon.
- Positive growth percentage.
- “View Account” action.
- White card with a subtle lavender icon background.

### Card 3 — Investment Portfolio

- Example value: ₹50,12,078.00.
- Portfolio icon.
- Investment growth percentage.
- “Analyze Portfolio” action.
- White card with a subtle emerald or lavender accent.

Use Indian rupee formatting consistently.

Animate all balances using a smooth count-up effect when the dashboard first appears. Animate percentage indicators and icons with subtle motion.

Cards should gently lift on hover, with a restrained shadow transition and a small arrow movement on their action links.

Respect reduced-motion preferences.

Use clearly labeled demonstration data rather than implying that fabricated balances represent real financial accounts.

## 5. WALLET AND ACCOUNTS PANEL

Create a “My Wallet” panel inspired by the reference.

Include a small exchange-rate information line, using static demonstration values unless a genuine exchange-rate service is configured.

Display four compact wallet or currency cards:

- INR — ₹22,678.00
- USD — $22,678.00
- EUR — €18,345.00
- GBP — £15,000.00

Each card should contain:

- Currency icon or flag.
- Currency code.
- Formatted balance.
- Account status.
- Monthly spending limit.
- Three-dot actions menu.

Add an “Add Account” button that opens an animated dialog.

Provide working interface states for viewing account details, hiding balances, selecting an account, and opening the account actions menu.

Do not implement fake currency conversions that appear live. Clearly identify illustrative rates or connect a real exchange-rate API when configured.

## 6. CASH FLOW ANALYTICS

Create a large, elegant financial analytics panel beside the wallet section.

Display:

- Heading: Cash Flow.
- Main value: ₹3,42,323.44.
- Income and expense summary.
- Monthly/Yearly toggle.
- Interactive bar chart with Jan–Dec labels.
- Income and expense comparison.
- Custom chart tooltips.
- Axis labels and appropriate Indian rupee formatting.
- A legend with clearly distinguishable series.

Use Recharts and Framer Motion or Motion for React where appropriate.

Animate chart bars on initial load with staggered timing. Add smooth transitions when switching between monthly and yearly views.

On hover, highlight the selected bar and show a tooltip containing the period, income, expenses, and net cash flow.

Charts must update when the user switches time ranges. Use coherent sample data and label it appropriately.

Include an accessible alternative or summary for users who cannot interpret the chart visually.

## 7. AI FIREWALL AND SECURITY OVERVIEW

This is a core differentiator of BANKISM. Integrate security monitoring directly into the dashboard without making the interface visually cluttered.

Create a dedicated AI Security Overview section containing four compact metrics:

1. Threats Detected.
2. Prompt Injection Attempts.
3. Transactions Flagged.
4. Policy Violations Blocked.

Use illustrative sample counts, status indicators, and trend comparisons.

Add a prominent security-status card:

- Status: Protected.
- AI Firewall: Active.
- Transaction Guardrails: Enabled.
- Policy Validation: Enabled.
- Last Security Scan: Demonstration timestamp.
- “View Security Center” action.

Add an animated security activity timeline with events such as:

- Suspicious payment request flagged.
- Prompt injection attempt blocked.
- Transaction passed policy validation.
- Unusual transaction sent for review.

Use subtle green pulses for healthy status, amber indicators for warnings, and red only for serious threats.

Create a small animated threat activity chart and a donut chart showing illustrative classifications of blocked requests.

Donut chart requirements:
- Animated segment drawing.
- Smooth center-value transitions.
- Hover highlighting.
- Percentage labels or an informative legend.
- Responsive sizing.
- No unnecessary animation loops.

Security animations should communicate system state rather than create a false impression of live monitoring. Clearly distinguish demo events from real backend telemetry.

## 8. RECENT TRANSACTIONS TABLE

Create a spacious “Recent Transactions” panel matching the reference image.

Include:

- Search input.
- Filter dropdown.
- Date-range filter.
- Status filter.
- Transaction type filter.
- Export CSV action.
- Select-all checkbox.
- Individual row selection.
- Pagination.
- Empty-state design.

Table columns:

- Transaction.
- Reference ID.
- Date.
- Time.
- Amount.
- Payment Method.
- Status.
- Security Risk.
- Actions.

Use realistic, clearly identified demonstration transactions, such as:

- Grocery payment.
- Utility bill.
- Online subscription.
- Salary credit.
- Fund transfer.
- Investment purchase.

Use status badges for Completed, Pending, Failed, and Under Review.

Use green for completed, amber for pending or under review, and red for failed transactions.

Allow users to search and filter transactions interactively. The displayed results must actually change based on the selected filters.

Add animated row entrance transitions, subtle hover backgrounds, and a dropdown for viewing transaction details.

Use proper accessible table semantics and avoid excessive motion when the user changes pages.

## 9. QUICK ACTIONS

Add a compact quick-actions section or toolbar containing:

- Transfer Money.
- Pay a Bill.
- Add Beneficiary.
- Download Statement.

Each action should open a working dialog, drawer, or dedicated route.

Build polished form interfaces with input validation and clear confirmation steps.

For money transfers, include:
- Source account.
- Beneficiary.
- Amount.
- Optional note.
- Review screen.
- Confirmation dialog.

IMPORTANT SECURITY REQUIREMENT: This frontend is a demonstration unless a real backend is connected. Never claim that money has actually been transferred. Use a clearly labeled simulated transaction flow.

If a real backend exists, use the existing API architecture and server-side authorization. Never trust frontend validation as the only security control.

## 10. ANIMATION SYSTEM

Use a consistent, refined motion system across the entire application.

### Initial page entrance
- Main dashboard fades in with a slight upward movement.
- Summary cards enter with a subtle stagger.
- Numeric balances count upward.
- Chart bars animate into place.
- Security indicators appear with a restrained fade and scale transition.
- Recent transactions enter with a short stagger.

### Hover interactions
- Cards lift approximately 2–4 pixels.
- Buttons smoothly transition between colors.
- Icons move subtly where appropriate.
- Action arrows translate a few pixels.
- Dropdown menus fade and scale into place.
- Table rows receive a subtle background transition.

### Interactive transitions
- Navigation uses an animated active indicator.
- Dialogs use opacity and scale transitions.
- Tabs use a sliding active indicator.
- Filters update with smooth content transitions.
- Charts animate between supported datasets.
- Toast notifications slide into view.
- Sidebar opening and closing use smooth easing.

### Loading states
Build attractive skeleton loaders for:
- Summary cards.
- Analytics charts.
- Wallet accounts.
- Transactions.
- Security metrics.

### Motion constraints
- Prefer short transitions, typically 150–350ms for interactions.
- Use longer transitions only for deliberate page entrances and chart rendering.
- Use spring-based motion sparingly.
- Avoid continuous bouncing, excessive parallax, flashing, and constant decorative movement.
- Honor prefers-reduced-motion.
- Keep interactions responsive and avoid layout shifts.

## 11. FUNCTIONALITY REQUIREMENTS

Every visible interactive element must have a meaningful behavior.

Implement:
- Working navigation.
- Search behavior.
- Interactive date-range controls.
- Account selection.
- Balance visibility toggle.
- Functional chart period switching.
- Transaction filtering.
- Transaction search.
- Transaction detail dialogs.
- Working dialog open/close states.
- Form validation.
- Toast feedback.
- Notification dropdown.
- Profile dropdown.
- Responsive mobile navigation.
- Reset filters.
- CSV export for displayed transaction data.
- Loading, error, and empty states.

Do not create decorative buttons that do nothing. If a backend feature is not implemented, clearly label it as a demo or provide a sensible disabled state.

## 12. COMPONENT ARCHITECTURE

Create reusable, typed components and separate application logic from presentation.

Suggested structure:

src/
  components/
    layout/
      app-sidebar.tsx
      top-navigation.tsx
      page-container.tsx
      mobile-navigation.tsx
    dashboard/
      overview-header.tsx
      balance-card.tsx
      summary-cards.tsx
      wallet-panel.tsx
      wallet-account-card.tsx
      cash-flow-chart.tsx
      security-overview.tsx
      security-status-card.tsx
      threat-donut-chart.tsx
      recent-transactions.tsx
      transaction-table.tsx
      quick-actions.tsx
    ui/
      animated-number.tsx
      status-badge.tsx
      loading-skeleton.tsx
      empty-state.tsx
      confirmation-dialog.tsx
      toast-provider.tsx
  data/
    demo-accounts.ts
    demo-transactions.ts
    demo-security-events.ts
  hooks/
    use-dashboard-filters.ts
    use-reduced-motion.ts
  lib/
    utils.ts
    format-currency.ts
  types/
    account.ts
    transaction.ts
    security.ts
  pages/
    dashboard.tsx
    analytics.tsx
    transactions.tsx
    security-center.tsx
    settings.tsx
  App.tsx
  main.tsx

Adapt this structure to the existing project instead of blindly creating duplicate files. Keep components small, readable, reusable, and strongly typed.

## 13. RESPONSIVE DESIGN

Desktop:
- Full sidebar.
- Three summary cards in a row.
- Wallet and cash-flow chart in a two-column layout.
- Full transaction table.

Tablet:
- Compact sidebar.
- Two-column summary cards where appropriate.
- Responsive wallet and analytics panels.

Mobile:
- Slide-out navigation.
- One-column summary cards.
- Stacked wallet and chart sections.
- Horizontally scrollable or appropriately condensed transaction table.
- Full-width action buttons where useful.
- Mobile-friendly dialogs and touch targets.
- No horizontal overflow across the page.

Test layouts at approximately 1440px, 1024px, 768px, and 375px.

## 14. ACCESSIBILITY AND SECURITY

- Use semantic HTML and accessible form labels.
- Provide keyboard navigation and visible focus indicators.
- Give icon-only buttons accessible labels.
- Maintain readable color contrast.
- Support reduced-motion preferences.
- Never expose secrets, API keys, or credentials in frontend code.
- Never store authentication tokens in insecure locations.
- Keep authorization and financial transaction validation on the backend.
- Avoid logging sensitive account details.
- Use mock data until authenticated APIs are available.
- Do not claim security monitoring is real unless connected to actual backend telemetry.

## 15. FINAL IMPLEMENTATION CHECKLIST

Before finishing:

1. Inspect the existing codebase.
2. Implement the dashboard in the actual project.
3. Install missing dependencies only.
4. Build all reusable components.
5. Implement animations and responsive layouts.
6. Wire up the dashboard's interactive states.
7. Verify that charts, search, filters, menus, dialogs, and buttons work.
8. Check for TypeScript errors.
9. Run the available lint and production build commands.
10. Fix compilation errors, missing imports, broken routes, and runtime problems.
11. Ensure the dashboard looks polished with realistic sample data.
12. Report the files created or modified and the commands required to run the application.

Do not stop after generating a plan or a visual mockup. Implement the actual application in the repository.

**FINAL DESIGN GOAL:** The result should resemble the provided reference dashboard in layout and visual quality, but feel more advanced through restrained premium animations, interactive financial analytics, responsive behavior, and an integrated AI banking-security layer. It must look like a real, carefully designed fintech product—not a generic admin template.