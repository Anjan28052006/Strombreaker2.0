Banker Dashboard UI:

Act as a senior product designer, creative frontend engineer, financial dashboard specialist, and motion designer.

Your task is to design and implement a premium, production-quality BANKING DASHBOARD for my existing project:

BANKISM — AI Firewall for Secure Banking.

I have attached a banking dashboard screenshot as the visual reference.

Study the screenshot carefully before writing code. Pay attention to its color palette, typography, layout proportions, card hierarchy, chart design, orange gradients, sidebar, transaction list, spacing, and interaction patterns.

Recreate the visual language of the reference while adapting the interface to Bankism's secure banking application.

IMPORTANT INSTRUCTIONS:

1. Inspect the existing repository before modifying anything.
2. Implement the actual dashboard in the existing frontend.
3. Preserve the current project structure, routing, authentication, and working functionality.
4. Reuse existing components and dependencies where possible.
5. Integrate with the existing backend APIs wherever available.
6. Do not generate a disconnected design mockup.
7. Do not replace the entire application with a new project.
8. Do not fabricate banking data or claim transactions succeeded when they have not.
9. After implementation, run the available checks and fix integration errors.

The final result should look like a carefully designed, premium fintech product rather than a generic admin template.

==================================================
1. DESIGN DIRECTION — PREMIUM DARK FINTECH
==================================================

The reference uses a sophisticated dark financial dashboard with warm brown surfaces, amber-orange highlights, muted borders, and vivid green indicators for positive financial changes.

Preserve this visual identity.

COLOR PALETTE:

Primary background:
Near-black espresso: #100C09

Secondary background:
Dark chocolate: #19120E

Primary card background:
#201713

Secondary card background:
#271B14

Subtle border:
rgba(255, 255, 255, 0.08)

Primary text:
Warm white: #F5F1ED

Secondary text:
Muted warm gray: #A69B91

Tertiary text:
#756A62

Primary accent:
Amber-orange: #FF861A

Secondary accent:
Bright orange: #FFA12B

Warm gradient:
linear-gradient(135deg, #A94D0C, #FF8A1F, #FFB54A)

Success:
#36D399

Negative financial change:
#F87171

Chart grid:
rgba(255, 255, 255, 0.06)

Do not use these colors mechanically. Establish reusable design tokens and adjust shades where needed to match the reference.

VISUAL RULES:

- Keep the overall page dark.
- Use warm brown tones instead of flat gray cards.
- Reserve bright orange for important actions and featured cards.
- Use green for positive financial indicators and verified success states.
- Use red sparingly for negative values and genuinely blocked or failed operations.
- Keep card borders subtle.
- Use soft shadows to establish depth.
- Avoid excessive glassmorphism.
- Avoid placing glowing borders around every component.
- Avoid making every card orange.
- Maintain a clear visual hierarchy between primary, secondary, and supporting information.

The entire dashboard must feel cohesive and intentionally designed.

==================================================
2. TYPOGRAPHY AND SPACING
==================================================

Use a modern, refined sans-serif typeface.

If the project already has a typography system, use it.

Otherwise, use a suitable font such as Inter, Geist, or Manrope, depending on existing dependencies and loading arrangements.

Typography hierarchy:

- Main financial values: large, clean, semibold.
- Section headings: medium-sized and semibold.
- Card titles: compact and medium-weight.
- Labels: small, muted, readable.
- Supporting descriptions: smaller but comfortably legible.
- Transaction amounts: semibold with clear positive/negative distinction.

Avoid excessively bold typography everywhere.

The reference uses compact information density but maintains enough spacing to distinguish each financial section.

Reproduce that balance.

Use a consistent spacing system and align card edges precisely.

All monetary values should use appropriate currency formatting.

For Bankism's Indian banking context, use INR formatting, for example:

₹1,25,000.00

Do not copy the reference's USD amounts as actual Bankism account data.

==================================================
3. APPLICATION SHELL AND LEFT SIDEBAR
==================================================

Create a slim, dark vertical navigation sidebar on the left side of the dashboard.

Follow the reference's proportions and compact icon navigation.

At the top, display the Bankism brand icon.

Use an appropriate banking or shield icon from the icon library already installed in the project.

The logo should be compact and refined.

Navigation items:

1. Overview
2. Accounts
3. Transactions
4. AI Assistant
5. Money Requests
6. Investments
7. Notifications

Place Settings and Sign Out at the bottom.

Use appropriate icons from the existing icon library, preferably Lucide React if already installed.

SIDEBAR DESIGN:

- Dark espresso background.
- Subtle separation from the main dashboard.
- Rounded active navigation indicator.
- Orange accent for the active item.
- Muted icons for inactive items.
- Small, elegant hover highlights.
- Clear keyboard focus states.
- Consistent spacing.

The Overview item should be selected when the dashboard first opens.

INTERACTIONS:

- Navigation items must use the existing application's routes.
- Do not create decorative links that do nothing.
- Respect authentication and authorization.
- Show only navigation items that are appropriate for the user's role.

For smaller desktop screens, consider a compact sidebar.

For mobile, convert the navigation to a suitable drawer or bottom navigation pattern.

Do not let the sidebar consume excessive horizontal space.

==================================================
4. TOP NAVIGATION BAR
==================================================

Create a horizontal top bar similar to the screenshot.

The top bar contains:

LEFT:
A search field with the placeholder:

"Search accounts, transactions..."

CENTER OR RIGHT:
A compact keyboard-shortcut hint where appropriate.

RIGHT:
- Refresh or data-update control.
- Notifications icon with an unread indicator when applicable.
- Theme control only if dark/light themes are actually supported.
- User avatar or initials.
- Customer name.
- Small account label or email.
- Profile dropdown.

The user profile should display real authenticated user information when available.

Do not hardcode the reference's fictional name.

DESIGN:

- Dark background continuous with the dashboard.
- Minimal borders.
- Comfortable horizontal spacing.
- Small icons with consistent stroke width.
- Compact controls.
- Subtle hover transitions.

SEARCH BEHAVIOR:

Implement functional search for the data currently supported by the application.

Where appropriate, search should cover accounts, transactions, and available dashboard actions.

If global search is not implemented in the backend, provide a clearly scoped local search instead of pretending to search all banking records.

Keyboard shortcuts must work if displayed.

==================================================
5. MAIN CONTENT LAYOUT
==================================================

Recreate the reference's dashboard composition using a responsive multi-column layout.

DESKTOP STRUCTURE:

The main dashboard area should contain:

LEFT AND CENTER REGION:
- Total Balance panel.
- Balance history chart.
- Financial summary information.
- Promotional or financial guidance card.
- Investments chart or an available financial summary.

RIGHT REGION:
- Account or payment card panel.
- Quick banking actions.
- Recent Transactions list.

The right region should appear visually anchored to the main dashboard, as in the reference.

Use a layout similar to:

┌─────────────────────────────────────────────────────────────┐
│ Sidebar │ Search                         Profile/Alerts      │
├─────────┼───────────────────────────────┬───────────────────┤
│         │                               │                   │
│         │ Total Balance                 │ Account Summary   │
│         │ Balance History Chart         │                   │
│         │                               │                   │
│         ├──────────────────┬────────────┤ Quick Actions     │
│         │ Financial Card   │ Investment │                   │
│         │ or Guidance      │ Summary    │ Recent Trans.    │
│         │                  │            │                   │
└─────────┴──────────────────┴────────────┴───────────────────┘

This diagram communicates the intended hierarchy, not fixed dimensions.

Use CSS Grid where appropriate.

The right-hand panel should be wide enough to display readable account details and transaction amounts.

Avoid overlapping cards or overly narrow columns.

The dashboard must fit naturally within the viewport without forcing horizontal scrolling on desktop.

==================================================
6. TOTAL BALANCE CARD AND AREA CHART
==================================================

This is one of the most important components.

Create a large balance visualization panel inspired by the upper-left region of the reference.

HEADER:

Title:
"Total Balance"

Below it, display the customer's actual available account balance.

Example formatting:
₹1,25,000.00

Beside the balance, display an appropriate percentage or amount change only if valid historical information is available.

Example presentation:
↑ 2.92%

Do not fabricate growth percentages.

If a historical comparison cannot be calculated, omit the percentage or clearly identify the data as sample information in a development demo.

TIME FILTERS:

Provide:

- 1 Month
- 3 Months
- 6 Months
- 1 Year

The active option should have a subtle highlighted pill.

Use smaller muted text for inactive options.

BALANCE CHART:

Create an elegant area chart with:

- Thin amber-orange line.
- Smooth but data-faithful curve.
- Semi-transparent orange gradient fill beneath the line.
- Subtle horizontal grid lines.
- Muted vertical value labels.
- Compact monthly labels.
- Restrained highlighting of the active data point.
- No unnecessary chart borders.

The chart should visually resemble the reference's orange financial graph.

The orange area should gradually fade into the dark background.

INTERACTIONS:

When a user hovers over the chart:

- Display a compact tooltip.
- Show the actual date.
- Show the historical balance at that point.
- Highlight the associated data point.

When a user changes the time filter, update the displayed data range when supported by the backend.

Keep chart animation smooth and restrained.

Do not invent a historical balance series from a single current-balance value.

If historical financial data is unavailable, show an honest empty state or clearly labeled demonstration data.

Below the graph, provide a compact legend when useful.

Possible entries:

- Historical balance
- Selected period

Do not include misleading financial metrics.

CHART IMPLEMENTATION:

Inspect existing dependencies first.

If an appropriate charting library is already installed, reuse it.

Otherwise, choose a lightweight charting solution compatible with the existing project.

Ensure the chart resizes correctly.

Do not recreate complex charts using hundreds of manually positioned DOM elements.

==================================================
7. RIGHT PANEL — ACCOUNT CARD
==================================================

Create an attractive account summary card on the right side of the dashboard.

In the reference, the panel has a vivid orange background with several overlapping payment cards.

Adapt this idea to Bankism while avoiding unnecessary imitation of real payment card credentials.

PANEL DESIGN:

- Warm orange and amber gradient.
- Rounded corners.
- Subtle ambient light.
- Dark account cards layered inside the panel.
- Appropriate spacing and shadows.

Heading:
"My Accounts"

Provide a compact action in the upper-right corner:

"View All"

Inside the panel, display one or more account summary cards when the authenticated user's actual accounts are available.

Each card can display:

- Account type.
- Masked account number.
- Currency.
- Available balance.
- Account status when relevant.

Example:

Savings Account

•••• •••• 4821

Available Balance

₹85,000.00

Use sample information only when the interface is operating in a clearly identified demo environment.

Do not fabricate bank-issued cards or imply that an account number or card was issued by an actual financial institution.

Do not expose complete account numbers unnecessarily.

LAYERED CARD VISUAL:

For a premium appearance, use a dark foreground account card with one or two partially visible cards behind it.

Use subtle offsets rather than extreme overlap.

Ensure that important text is never obscured.

Do not create a fake credit-card number, CVV, or expiration date.

If Bankism does not implement payment cards, present these as account summary cards rather than claiming that physical or virtual cards exist.

==================================================
8. QUICK BANKING ACTIONS
==================================================

Below the account panel, create two prominent action buttons.

Primary actions:

1. Request Money
2. Transfer Money

Arrange them horizontally when there is sufficient space.

Use two subtly different warm styles:

REQUEST MONEY:
A muted amber or dark brown button.

TRANSFER MONEY:
A more prominent bright orange button.

Both buttons should contain appropriate icons and concise labels.

BUTTON INTERACTIONS:

- Smooth hover background transition.
- Slight brightness increase.
- Clear pressed state.
- Keyboard focus indicator.

FUNCTIONALITY:

Connect them to the actual workflows implemented in the existing application.

The transfer action should open the existing transfer flow.

The money request action should open the existing request workflow.

Do not implement the actual transfer by changing a frontend balance value.

A transfer must follow the backend's required process, including:

- Authentication.
- Recipient validation.
- Amount validation.
- Transaction preparation.
- Explicit user confirmation.
- Backend execution.
- Persisted transaction result.

If the current banking flow is incomplete, connect the buttons to the implemented stages and clearly represent unavailable stages rather than fabricating successful transactions.

==================================================
9. RECENT TRANSACTIONS PANEL
==================================================

Create a clean, compact transaction list below the account section.

Header:

"Recent Transactions"

Place a "View All" action on the right.

Each transaction row should display:

- Merchant or counterparty avatar/icon.
- Transaction description.
- Formatted date and time.
- Signed amount.
- Appropriate semantic color.

Use a combination of dark cards and subtle separators.

Example presentation using illustrative demo data:

Salary Credit
10 Oct, 10:30 AM
+₹45,000.00

Groceries
09 Oct, 06:15 PM
-₹1,250.00

UPI Payment
09 Oct, 02:10 PM
-₹500.00

These examples are illustrative only. Connect the component to actual transaction records when available.

POSITIVE AMOUNTS:

Use green for completed incoming funds.

NEGATIVE AMOUNTS:

Use a restrained red or muted warm-red color for outgoing funds.

PENDING TRANSACTIONS:

Display an appropriate pending indicator instead of treating them as completed.

FAILED OR CANCELLED TRANSACTIONS:

Display their actual state.

TRANSACTION ROW INTERACTIONS:

- Subtle background highlight on hover.
- Clear text alignment.
- Amounts aligned consistently.
- Compact but readable typography.
- Clicking a row opens transaction details if that route exists.

The list must use real persisted transaction records.

Do not create fake transactions merely to fill the screen in production.

Include a clean empty state when the user has no transactions.

If transaction history is paginated, load the intended number of recent records efficiently.

==================================================
10. LOWER CONTENT — FINANCIAL GUIDANCE AND INVESTMENTS
==================================================

Reproduce the reference's lower-left promotional card and adjacent chart, adapting their purpose to Bankism.

A. FINANCIAL GUIDANCE CARD

Create a warm orange feature card titled:

"Your Finances, Clearly."

Description:

"Understand your account activity and make informed financial decisions."

Include a small shield or financial-insights icon and a button:

"Explore Insights"

Design:

- Amber-orange gradient.
- Soft lighting.
- Dark text where contrast permits.
- Rounded corners.
- A restrained decorative visual.
- Strong typographic hierarchy.

The card should remain compact and should not dominate the dashboard.

Connect the button to an existing, relevant feature if one is available.

Do not promise investment returns or financial outcomes.

B. INVESTMENTS OR FINANCIAL ACTIVITY

The reference contains an Investments bar chart with month labels and a highlighted green bar.

For Bankism, display investment information only if that functionality and data source genuinely exist.

If investment management is not implemented, use the area for a supported financial activity summary instead.

Possible alternative:

"Monthly Spending"

Show a monthly bar chart using transaction records aggregated by month.

The chart should include:

- Dark background.
- Minimal chart grid.
- Muted labels.
- Warm brown inactive bars.
- One subtle green or cyan accent for the selected period.
- Compact tooltip.
- Responsive sizing.

Do not label outgoing expenses as investments.

Do not generate imaginary investment balances.

If the underlying data is unavailable, show an informative empty state or clearly labeled development data.

==================================================
11. MICRO-INTERACTIONS AND ANIMATIONS
==================================================

The dashboard should feel refined and responsive without becoming distracting.

PAGE ENTRANCE:

- Load the layout without a large layout shift.
- Fade in the main content subtly.
- Introduce a slight upward movement only if it does not delay usability.
- Keep the animation short.

CARDS:

- Subtle background changes on hover.
- Soft shadow enhancement.
- No dramatic scaling.
- No continuous rotation.
- No exaggerated glowing borders.

CHARTS:

- Smooth initial drawing where supported.
- Fade in tooltips.
- Update highlights smoothly when periods change.

BUTTONS:

- Short, smooth hover transitions.
- Clear focus and active states.
- Avoid excessive bounce.

SIDEBAR:

- Smooth active indicator.
- Subtle icon hover changes.

ACCOUNT CARDS:

- A small visual lift on hover, where appropriate.
- No movement that disrupts the surrounding layout.

Follow the existing animation framework if one is installed.

Otherwise, use efficient CSS transitions and a suitable chart animation approach.

Respect the prefers-reduced-motion setting.

Do not hijack normal scrolling.

Do not create animations that continuously consume excessive CPU or GPU resources.

==================================================
12. SEARCH, FILTERS, AND DASHBOARD INTERACTIONS
==================================================

The top search field should be functional.

Provide sensible search behavior for supported data.

The transaction list may support searching by:

- Transaction description.
- Counterparty.
- Transaction reference, where permitted.

Do not expose sensitive information through search.

If the backend supports transaction filters, integrate with those endpoints.

The refresh control should actually re-fetch or revalidate relevant data when clicked.

The notifications icon should display real unread information when the backend supports it.

The profile dropdown should expose appropriate account actions.

Do not render nonfunctional controls solely for visual appearance.

Every prominent interactive control should have a meaningful action, a disabled state, or a clear explanation when the associated feature is unavailable.

==================================================
13. BACKEND AND SECURITY INTEGRATION
==================================================

This is Bankism, a secure banking application.

Inspect the existing API client, authentication flow, backend endpoints, and response formats before connecting the dashboard.

Reuse the current backend architecture.

Possible existing endpoints include:

GET /api/v1/accounts/me

GET /api/v1/accounts/me/balance

GET /api/v1/accounts/me/transactions

GET /api/v1/notifications

Verify the actual paths and response schemas rather than assuming they exist exactly as written.

The dashboard should:

- Display actual authenticated account information.
- Request only data the current user is authorized to access.
- Handle loading states.
- Handle empty states.
- Handle API failures.
- Handle expired authentication.
- Avoid unnecessary repeated requests.
- Preserve the existing token/session-handling architecture.

Do not send requests on behalf of an unauthenticated user to protected banking endpoints.

Do not trust a user ID supplied by the frontend to determine whose banking information should be returned.

The backend must enforce account ownership and authorization.

IMPORTANT FINANCIAL SECURITY RULE:

Frontend state is not the source of truth for account balances or transaction status.

Never simulate a completed transfer by subtracting an amount from a displayed balance.

Never report a transfer as complete before the backend has confirmed the persisted result.

The AI security firewall and the ordinary backend transaction rules must remain in effect.

==================================================
14. RESPONSIVE DESIGN
==================================================

DESKTOP:

Use a compact sidebar, horizontal header, wide balance chart, and right-side account panel.

Preserve the reference's multi-panel composition.

TABLET:

Reduce the number of columns.

Keep the balance chart prominent.

Move account summaries below or beside the main content according to available space.

MOBILE:

- Replace the desktop sidebar with a drawer or suitable bottom navigation.
- Stack the balance panel, account summary, quick actions, and transaction list vertically.
- Use a full-width balance card.
- Keep actions easy to reach.
- Ensure transaction amounts remain readable.
- Prevent charts from overflowing.
- Maintain reasonable touch targets.
- Preserve comfortable spacing.

Do not simply scale the desktop dashboard down.

Use responsive layout rules that rearrange the hierarchy intelligently.

Avoid horizontal page scrolling.

==================================================
15. ACCESSIBILITY AND PERFORMANCE
==================================================

Requirements:

- Semantic HTML.
- Accessible names for icon buttons.
- Keyboard navigation.
- Visible focus indicators.
- Appropriate text contrast.
- Screen-reader-friendly financial chart summaries.
- Accessible tooltips where practical.
- Appropriate loading announcements.
- Reduced-motion support.
- Efficient rendering of transaction lists.
- Responsive chart resizing.
- No unnecessary heavyweight animation libraries.

Use a consistent icon family.

Do not use random emoji as replacements for professional financial icons.

Avoid oversized blur filters over large areas.

Maintain a stable layout while data loads.

==================================================
16. COMPONENT ARCHITECTURE
==================================================

Inspect the existing structure before creating components.

A possible component organization is:

BankingDashboard
├── DashboardSidebar
├── DashboardHeader
│   ├── GlobalSearch
│   ├── NotificationsButton
│   └── UserProfileMenu
├── DashboardContent
│   ├── BalanceOverview
│   │   ├── BalanceSummary
│   │   ├── BalancePeriodFilter
│   │   └── BalanceAreaChart
│   ├── AccountPanel
│   ├── BankingQuickActions
│   ├── FinancialGuidanceCard
│   ├── FinancialActivityChart
│   └── RecentTransactions
└── DashboardNotifications

Create reusable components where they provide meaningful benefits.

Keep API requests and business logic separate from visual components.

Use the existing project's conventions rather than forcing this exact structure if a different structure already exists.

Avoid:

- Giant monolithic components.
- Duplicate API clients.
- Repeated financial formatting logic.
- Hardcoded customer identities.
- Duplicated design tokens.
- Unnecessary global state.
- Reimplementing existing working pages.

If the project has a shared dashboard layout, extend it instead of creating a separate incompatible layout.

==================================================
17. IMPLEMENTATION AND VALIDATION
==================================================

Before editing:

1. Inspect the repository.
2. Identify the frontend framework and current design system.
3. Identify the existing routes and authentication flow.
4. Inspect existing account and transaction APIs.
5. Identify installed charting, icon, and animation libraries.
6. Determine which requested financial features are already implemented.

Then implement the dashboard using the existing architecture.

After implementation:

1. Run the available build and validation commands.
2. Fix import errors.
3. Fix styling and layout problems.
4. Verify desktop and mobile responsiveness.
5. Verify the balance chart renders correctly.
6. Verify period filters work where historical data exists.
7. Verify transaction data comes from the intended source.
8. Verify account ownership is respected by the backend.
9. Verify loading, empty, and error states.
10. Verify the quick action buttons navigate to actual workflows.
11. Ensure no fake financial success states have been introduced.
12. Confirm unrelated pages continue to work.

Do not claim a test passed unless it was actually executed.

If a requested feature depends on an unavailable backend endpoint, document the limitation and implement an honest fallback rather than pretending the API exists.

==================================================
FINAL EXPECTATION
==================================================

Deliver a premium Bankism banking dashboard inspired by the attached image.

The final dashboard should feature:

- Dark espresso-and-chocolate surfaces.
- Elegant warm-white typography.
- A refined amber-orange area chart.
- A sophisticated account summary panel.
- Clear transfer and money request actions.
- A polished recent transactions list.
- A meaningful financial activity chart.
- A compact sidebar and elegant top navigation.
- Subtle animations.
- Functional interactions.
- Responsive behavior.
- Integration with the existing authentication and banking APIs.

The overall experience should communicate:

"Your money, clearly organized. Your banking, protected by intelligence."

Prioritize visual accuracy, functional correctness, accessibility, financial-data integrity, and consistent integration with the existing Bankism application.

Inspect the repository first, then implement the complete working dashboard.