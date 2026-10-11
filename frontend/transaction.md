Transactions :

Act as a senior fintech UI/UX designer, frontend architect, and creative React engineer.

Your task is to implement a premium TRANSACTIONS & HISTORY interface for my existing project:

BANKISM — AI FIREWALL FOR SECURE BANKING.

I have attached a mobile banking UI screenshot as the design reference.

Study the screenshot carefully. Analyze its dark interface, lime-green accents, typography, rounded cards, financial analytics, transaction categories, navigation, and transaction history layout.

Use the reference as the primary visual inspiration while adapting everything to Bankism's existing application architecture.

IMPORTANT:
Do not simply generate a static mockup or explain how to implement the interface.

Inspect my existing repository, implement the actual working Transactions page, integrate it with the existing backend APIs, and verify the implementation.

Preserve existing authentication, routing, reusable components, design tokens, and working functionality.

Do not rewrite unrelated parts of the application.

==================================================
1. DESIGN VISION
==================================================

Create a sophisticated, modern banking transaction interface inspired by the attached reference.

The page should communicate:

- Clear visibility into banking activity.
- Easy access to historical transactions.
- Transparent incoming and outgoing payments.
- Understandable spending and income analytics.
- Secure access to transaction information.

VISUAL STYLE:

Use a near-black background with dark charcoal surfaces, subtle borders, rounded cards, clean typography, and restrained neon-lime accents.

Suggested color palette:

Primary background: #0A0A0B
Secondary background: #111214
Card background: #18191C
Elevated card background: #202125
Primary text: #F5F5F5
Secondary text: #A1A1AA
Muted text: #71717A
Primary accent: #A8F04A
Accent hover: #BAFF61
Positive amount: #A8F04A
Negative amount: #F87171
Secondary accent: #A6A3FF
Subtle border: rgba(255,255,255,0.08)

Use these colors as design tokens and adjust them to fit the existing application.

The lime-green accent should be used selectively for:
- Active filters.
- Positive balance changes.
- Selected chart points.
- Important transaction indicators.
- Primary interactive states.

Use red for negative financial changes or failed operations, not as a generic decorative color.

The page should feel premium and polished, not excessively neon.

Avoid excessive glassmorphism, large glowing borders, unnecessary gradients, and cluttered layouts.

IMPORTANT DESIGN CONSISTENCY:

Inspect Bankism's existing dashboard before choosing the final colors.

If the application already has an established design system, preserve its underlying visual identity while adapting the layout and interaction patterns from this reference.

Do not create a visually disconnected page.

==================================================
2. PAGE STRUCTURE
==================================================

Create a complete Transactions page with the following hierarchy:

1. Existing Bankism application navigation.
2. Transactions page header.
3. Transaction summary cards.
4. Transaction analytics chart.
5. Transaction categories and filters.
6. Transaction history list.
7. Transaction details view.
8. Pagination or load-more functionality, where appropriate.

On desktop, use a well-organized dashboard layout.

On mobile, adapt the interface to resemble the compact, rounded mobile banking design in the reference.

The transaction history must remain the central focus of the page.

==================================================
3. PAGE HEADER
==================================================

At the top of the page, display:

Heading:
"Transactions"

Subtitle:
"Track your payments, incoming funds, and banking activity."

On the right side, provide an optional date-range selector or refresh control if supported by the existing application.

Use:
- Clear, medium-large typography.
- White heading text.
- Muted secondary text.
- Comfortable spacing.
- Subtle entrance animation.

Do not add an oversized hero section. Users should reach their transaction history quickly.

==================================================
4. TRANSACTION SUMMARY CARDS
==================================================

Create a row of compact financial summary cards.

Recommended cards:

CARD 1: Total Incoming

Display the total money received during the selected period.

Use the lime-green accent sparingly.

CARD 2: Total Outgoing

Display the total money spent or transferred during the selected period.

Use a muted red accent for the amount or supporting indicator.

CARD 3: Net Cash Flow

Calculate the difference between qualifying incoming and outgoing transactions during the selected period.

CARD 4: Transaction Count

Display the number of transactions in the selected period.

Each card should contain:

- A concise label.
- A formatted INR amount or count.
- A small relevant icon.
- Optional comparison with a previous period, but only when historical data supports the comparison.

VISUAL STYLE:

- Dark charcoal background.
- Rounded corners.
- Thin, subtle border.
- Compact typography.
- Generous internal spacing.
- Restrained accent colors.
- Subtle hover interaction.

Do not use excessively bright gradients.

FINANCIAL ACCURACY:

Calculate totals from actual transaction records.

Use integer paise or the backend's established monetary representation for calculations.

Do not use floating-point arithmetic for financial aggregation when reliable integer-based calculations are available.

Do not fabricate percentage increases, savings figures, or financial comparisons.

If historical data is insufficient, display the available information without inventing comparisons.

==================================================
5. TRANSACTION ANALYTICS
==================================================

Create a visually attractive analytics panel inspired by the right-hand phone in the reference.

Panel heading:
"Transaction Analytics"

Provide compact filter pills:

ALL
INCOME
EXPENSES
TRANSFERS

The selected filter should use a lime-green accent.

Inactive filters should remain dark with muted text.

If appropriate to the existing data model, distinguish transfers from other outgoing expenses rather than treating all spending as equivalent.

CHART DESIGN:

Create a dark, minimal line chart with:
- Smooth, readable lines.
- Subtle grid lines.
- Muted date labels.
- Restrained lime-green highlights.
- A secondary lavender line where useful.
- A highlighted selected data point.
- A compact tooltip.
- Responsive sizing.

The chart may show qualifying transaction totals over time, depending on available backend data.

For example:
- Incoming funds by month.
- Outgoing payments by month.
- Transaction volume over time.

Provide a period selector:

1M
3M
6M
1Y

If the backend does not support the selected date range, handle the limitation honestly rather than presenting fabricated data.

Do not use arbitrary chart data in the production interface.

When chart data is unavailable, provide a clean empty state.

The chart must resize correctly on desktop and mobile.

Use an existing charting library where appropriate, or select a lightweight compatible library if necessary.

Do not build a chart using large numbers of manually positioned DOM elements.

==================================================
6. TRANSACTION FILTERS AND SEARCH
==================================================

Below the analytics section, build a functional transaction filtering interface.

Provide category filters:

ALL
INCOME
EXPENSES
TRANSFERS
PENDING

Additional useful filters may include:

COMPLETED
FAILED
CANCELLED

Use the statuses supported by the existing backend.

Display the active filter in lime green.

Use compact pill-shaped controls similar to the reference.

Add a search field with this placeholder:

"Search transactions..."

SEARCH BEHAVIOR:

Allow users to search supported transaction attributes, such as:

- Transaction description.
- Merchant or counterparty name.
- Transaction reference, if appropriate.

Do not expose confidential information through search.

FILTER BEHAVIOR:

Users should be able to filter by:
- Transaction type.
- Transaction status.
- Date range.
- Search query.

Filters should work together.

For example, selecting EXPENSES and entering "Grocery" should display only matching outgoing transactions.

Include a date-range control where supported.

Provide a sorting option:

- Newest first.
- Oldest first.
- Amount: high to low.
- Amount: low to high.

Use backend sorting and pagination when available.

Otherwise, implement the supported sorting and filtering efficiently on the loaded records.

Do not create decorative filter buttons that do nothing.

==================================================
7. TRANSACTION HISTORY — THE MOST IMPORTANT SECTION
==================================================

Create a polished, readable transaction history panel.

Section heading:

"Transaction History"

Supporting text:

"Review your recent banking activity."

Add a "View All" or equivalent control if a summarized transaction list appears elsewhere in the application.

The transaction history must display the customer's actual persisted banking transactions.

TRANSACTION ROW DESIGN:

Each row should contain:

1. Merchant, counterparty, or transaction-type icon.
2. Transaction description.
3. Counterparty or merchant name, where appropriate.
4. Transaction date and time.
5. Transaction category.
6. Transaction status.
7. Transaction amount.
8. Optional detail indicator.

Example visual structure:

┌────────────────────────────────────────────────────────┐
│ [Icon]  Salary Credit                   +₹45,000.00    │
│         Incoming payment                               │
│         10 Oct, 10:30 AM       COMPLETED               │
├────────────────────────────────────────────────────────┤
│ [Icon]  UPI Payment                      -₹500.00      │
│         Transfer to recipient                          │
│         09 Oct, 02:10 PM       COMPLETED               │
├────────────────────────────────────────────────────────┤
│ [Icon]  Online Purchase                -₹1,250.00      │
│         Merchant payment                               │
│         09 Oct, 06:15 PM       PENDING                 │
└────────────────────────────────────────────────────────┘

The records above are illustrative examples of layout only.

Never insert these example transactions into a real user's transaction history.

TRANSACTION AMOUNTS:

- Incoming transactions: prefix the amount with +.
- Outgoing transactions: prefix the amount with -.
- Use the appropriate semantic color.
- Format all displayed amounts as INR.

Example:
+₹25,000.00
-₹1,200.00

TRANSACTION STATUSES:

Display the actual persisted status.

COMPLETED:
Use a subtle green indicator.

PENDING:
Use a muted amber or neutral indicator.

FAILED:
Use a restrained red indicator.

CANCELLED:
Use muted gray text.

Do not display a transaction as completed merely because a request has been submitted.

Group transactions by date where doing so improves readability.

Possible groups:

TODAY
YESTERDAY
EARLIER THIS WEEK
PREVIOUS TRANSACTIONS

Use appropriate localization and date formatting.

The grouping must be based on actual transaction timestamps.

==================================================
8. TRANSACTION DETAILS
==================================================

When a user selects a transaction row, open a detailed transaction view.

Prefer a side drawer on desktop and a suitable modal or full-screen detail view on mobile.

Display available fields such as:

- Transaction reference.
- Transaction type.
- Amount.
- Transaction status.
- Date and time.
- Sender or recipient details, according to permissions.
- Transaction description or memo.
- Applicable processing information.

Only display fields supported by the actual backend response.

Mask sensitive information when full disclosure is unnecessary.

The transaction details view should include an appropriate close control.

Use subtle transitions when opening and closing the drawer.

Do not allow a customer to view transactions belonging to another user.

Do not expose hidden backend metadata, internal prompts, authentication tokens, or unnecessary personal information.

If a transaction has failed or is pending, show its actual status and any supported explanation.

Do not invent a failure reason.

==================================================
9. MOBILE-FIRST VISUAL ADAPTATION
==================================================

The reference shows a dark mobile banking experience with rounded cards, compact charts, pill-shaped filters, and bright lime highlights.

Reproduce those visual qualities.

DESKTOP LAYOUT:

- Preserve the existing Bankism sidebar and top navigation.
- Use a responsive summary-card grid.
- Place analytics above or beside transaction history.
- Give the transaction history enough width for readable descriptions and amounts.

TABLET LAYOUT:

- Reduce the number of columns where necessary.
- Keep filters accessible.
- Prevent chart labels from overlapping.

MOBILE LAYOUT:

- Stack summary cards into a compact grid.
- Make filters horizontally scrollable if required.
- Use compact chart labels.
- Show transaction descriptions and amounts clearly.
- Place transaction status in a secondary line where necessary.
- Maintain comfortable touch targets.
- Avoid horizontal page scrolling.

Do not merely shrink the desktop layout.

Reorganize the content hierarchy to suit smaller screens.

==================================================
10. INTERACTIONS AND MICRO-ANIMATIONS
==================================================

The interface should feel responsive and polished.

Use subtle animations for:

- Card entrance.
- Filter selection.
- Transaction row hover.
- Search focus.
- Chart tooltips.
- Detail drawer transitions.
- Loading indicators.

TRANSACTION ROW HOVER:

- Slightly brighten the background.
- Increase border contrast subtly.
- Avoid large movement or scaling.

FILTER TRANSITIONS:

- Smoothly change the active background.
- Preserve readable text contrast.
- Avoid flashing effects.

CHART ANIMATIONS:

- Animate chart drawing when appropriate.
- Transition selected data points smoothly.
- Keep tooltips readable.

LOADING STATES:

Show suitable skeleton placeholders while transaction data loads.

EMPTY STATES:

When the user has no transactions, display:

"No transactions yet"

Supporting message:

"Your banking activity will appear here when transactions are available."

ERROR STATES:

If the API fails, show an understandable error message and a retry action.

Do not silently replace failed API responses with fabricated transaction records.

Respect the user's reduced-motion preferences.

Do not hijack normal browser scrolling.

==================================================
11. BACKEND INTEGRATION
==================================================

Before implementing the UI, inspect the current Bankism repository.

Identify:
- The frontend framework.
- Existing routes.
- Authentication architecture.
- API client.
- Transaction API endpoints.
- Transaction model.
- Existing response schemas.
- Supported transaction statuses.
- Existing financial formatting utilities.

Reuse the current architecture.

The backend may expose endpoints such as:

GET /api/v1/transactions/me

or:

GET /api/v1/accounts/me/transactions

Inspect the actual implementation and use the correct endpoint.

Do not blindly assume that either endpoint has the exact response structure required by the UI.

DATA REQUIREMENTS:

Fetch transactions for the authenticated user.

Never trust a user ID supplied through the browser as proof of identity.

The backend must verify the authenticated user's account ownership and return only authorized transactions.

Use the existing API client and session-handling strategy.

Implement:
- Loading states.
- Error states.
- Empty states.
- Search and filters.
- Pagination.
- Refresh behavior.

Avoid unnecessary repeated API calls.

If pagination is supported, use it rather than fetching unlimited historical records.

Never fabricate banking results.

Never assume a transfer completed unless the backend's persisted state confirms it.

==================================================
12. SECURITY AND DATA INTEGRITY
==================================================

Bankism is a secure banking application.

The Transactions page must preserve all existing security boundaries.

Requirements:

- Authentication is required for protected transaction data.
- Backend authorization determines which transactions may be returned.
- Customers can access only their own permitted information.
- Transaction amounts come from actual persisted records.
- Transaction status comes from the backend.
- Sensitive identifiers are masked when appropriate.
- Account balances are never modified in frontend code.
- Transaction confirmation is not performed by merely changing the UI.
- Failed or blocked requests are not presented as successful transactions.

If the transaction backend does not yet exist or is incomplete, implement the interface against the actual available API contract and document any missing integration.

Do not weaken authentication or authorization to make the UI appear functional.

==================================================
13. COMPONENT ARCHITECTURE
==================================================

Inspect the existing project structure before creating components.

A possible organization is:

TransactionsPage
├── TransactionsHeader
├── TransactionSummary
│   ├── IncomingSummaryCard
│   ├── OutgoingSummaryCard
│   ├── CashFlowSummaryCard
│   └── TransactionCountCard
├── TransactionAnalytics
│   ├── TransactionTypeFilters
│   ├── DateRangeSelector
│   └── TransactionChart
├── TransactionControls
│   ├── TransactionSearch
│   ├── StatusFilter
│   ├── SortControl
│   └── DateFilter
├── TransactionHistory
│   ├── TransactionGroup
│   ├── TransactionRow
│   └── TransactionStatusBadge
└── TransactionDetailsDrawer

Adapt this organization to the actual codebase.

Create reusable components where appropriate.

Keep API calls, data transformations, financial calculations, and presentation logic reasonably separated.

Avoid:
- Giant components.
- Duplicated financial calculations.
- Duplicate API clients.
- Unnecessary global state.
- Repeated component markup.
- Hardcoded transaction records in production.
- Unnecessary dependencies.

Reuse Bankism's existing sidebar and shared dashboard layout.

==================================================
14. ACCESSIBILITY
==================================================

Ensure the interface works with a keyboard and assistive technology.

Requirements:

- Semantic headings.
- Accessible filter controls.
- Visible focus indicators.
- Accessible search input.
- Sufficient text contrast.
- Properly labeled icon buttons.
- Keyboard-accessible transaction details.
- Accessible loading and error announcements.
- Responsive and usable controls on touch devices.

Do not communicate transaction status through color alone. Include readable status labels.

==================================================
15. FINAL IMPLEMENTATION AND VERIFICATION
==================================================

Do not stop after producing the initial interface.

After implementation:

1. Run the available build or validation commands.
2. Fix import and styling errors.
3. Verify the Transactions page is connected to existing routing.
4. Verify the transaction API integration.
5. Verify that the current user's transaction records are displayed correctly.
6. Test incoming and outgoing transaction formatting.
7. Test status badges.
8. Test category and status filters.
9. Test search.
10. Test sorting and pagination where supported.
11. Test transaction details.
12. Test loading, empty, and error states.
13. Test mobile and desktop layouts.
14. Verify that unrelated functionality still works.

Do not claim that a test passed unless you actually executed it.

Do not hide backend failures by displaying hardcoded success data.

If a required API or backend capability is missing, report the specific limitation.

==================================================
FINAL EXPECTATION
==================================================

Deliver a premium Bankism Transactions & History page inspired by the supplied mobile banking reference.

The finished interface should include:

- A clean dark banking interface.
- Refined lime-green highlights.
- Transaction summary cards.
- Financial analytics.
- Functional transaction filters.
- Search and sorting.
- A complete transaction history.
- Clear transaction statuses.
- Detailed transaction views.
- Real backend integration.
- Responsive desktop and mobile layouts.
- Subtle, polished interactions.

The experience should communicate:

"Every transaction. Clearly tracked. Securely managed."

Inspect the repository first, then implement the complete working interface.