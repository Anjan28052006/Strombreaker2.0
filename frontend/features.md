Features section :

Act as a world-class creative frontend engineer, motion designer, and UI/UX specialist.

Your task is to design and implement a stunning, production-quality FEATURES SECTION for my existing project:

BANKISM — AI Firewall for Secure Banking.

I have attached a website screenshot as a visual reference. Study its layout, spacing, composition, lighting, animations, and overall visual language carefully before implementing anything.

IMPORTANT:
Use the screenshot as design inspiration, but adapt its content to Bankism. Do not copy the Clay branding, company name, or third-party application logos.

I want the final result to feel like a premium fintech security product website with sophisticated 3D visuals, subtle motion, high-quality typography, and polished interactions.

Do not just explain how to build it. Inspect my existing repository and implement the complete, working feature section in the actual frontend.

==================================================
1. CORE DESIGN VISION
==================================================

Create a dark, premium, visually rich features section inspired by the attached screenshot.

The design should communicate three things immediately:

1. Bankism understands natural-language banking requests.
2. Bankism detects malicious instructions and AI security threats.
3. Bankism protects banking operations by blocking unsafe requests.

VISUAL STYLE:

- Deep black and charcoal background.
- Subtle dark navy and blue gradients.
- Soft cyan and electric-blue highlights.
- Very subtle green highlights for safe operations.
- Restrained red highlights for blocked threats.
- Elegant serif typography for the main heading.
- Clean sans-serif typography for descriptions and controls.
- Floating 3D-style security icons.
- Soft reflections and realistic ambient shadows.
- Smooth gradients and subtle lighting.
- Carefully controlled spacing and visual hierarchy.

The design should feel modern, sophisticated, cinematic, and premium.

Avoid excessive glassmorphism, overused glowing borders, excessively bright colors, and unnecessary decorative elements.

The dark background must remain predominantly black. Use light effects only to emphasize important elements.

==================================================
2. SECTION HEADER
==================================================

At the top of the section, create a centered heading.

Main heading:

"Security That Thinks
Before It Acts."

Use an elegant, large serif font similar to the typography in the reference screenshot.

Below it, add this description:

"Explore how Bankism combines intelligent threat detection, AI guardrails, and deterministic security policies to protect every banking interaction."

Typography requirements:

- Large heading with refined letter spacing.
- Beautiful line height.
- Muted gray description.
- A restrained blue gradient accent on selected words, if visually appropriate.
- Generous vertical spacing.
- Responsive typography across desktop, tablet, and mobile.

Animate the heading and description into view when the section becomes visible.

The animation should be subtle: fade in while moving upward slightly.

Do not make the text bounce, rotate, or use exaggerated effects.

==================================================
3. FLOATING 3D SECURITY ICON DISPLAY
==================================================

This is the most visually important part of the section.

Study the screenshot's central arrangement of floating application icons.

Create a similar composition using Bankism-related icons instead of application logos.

Display a layered collection of floating icons representing:

- AI intelligence
- Prompt injection detection
- Cybersecurity shield
- Banking institution
- Secure transactions
- Policy validation
- Threat detection
- Data protection
- Authentication
- Audit logging
- Safe banking operations

Use appropriate icons from the icon library already installed in the project.

If necessary, use Lucide React icons or another lightweight icon solution already available.

Do not use unrelated third-party company logos.

VISUAL COMPOSITION:

Arrange the icons in several layers.

Foreground:
A few larger, prominent security icons.

Middle ground:
Medium-sized icons representing banking, AI, and validation.

Background:
Smaller, dimmer icons that create a sense of depth.

Create a subtle 3D perspective by varying icon size, opacity, blur, position, and shadow.

The icon collection should feel suspended in space, with a restrained blue and cyan glow.

ANIMATION:

When the section enters the viewport:

1. The icons fade into view.
2. They gradually move toward their designated positions.
3. The foreground icons appear slightly closer than the background icons.
4. The central cybersecurity shield becomes subtly illuminated.
5. The icons settle into a gentle, continuous floating animation.

Use slightly different animation durations and phases for individual icons so that the display does not look synchronized or mechanical.

Some icons may float vertically by a few pixels.

Others can rotate very slightly or shift horizontally.

Keep all movement subtle.

The icons must remain inside the section and must not obscure the heading or feature cards.

Add soft reflections beneath the icon arrangement, inspired by the reference screenshot.

These reflections should be blurred, low-opacity, and visually restrained.

The effect should suggest a premium 3D environment without requiring an actual 3D rendering engine.

Use CSS transforms, layered elements, gradients, shadows, and lightweight animation techniques.

Do not introduce a heavyweight 3D library unless the existing application genuinely requires it.

==================================================
4. INTERACTIVE CATEGORY FILTER BAR
==================================================

Below the floating icon display, create a horizontal category filter bar inspired by the screenshot.

Categories:

ALL
THREAT DETECTION
AI GUARDRAILS
BANKING SECURITY
MONITORING

Design requirements:

- Compact pill-shaped controls.
- Dark charcoal background.
- Subtle border.
- Muted text for inactive filters.
- Bright white text for the active filter.
- Soft blue accent around the selected category.
- Smooth transitions when switching categories.

Interaction requirements:

The filters must work.

When a user clicks a category, update the visible feature cards to show the appropriate category.

For example:

THREAT DETECTION:
Show prompt injection detection, jailbreak protection, policy override detection, and obfuscation detection.

AI GUARDRAILS:
Show input validation, output validation, secure tool execution, and conversation safeguards.

BANKING SECURITY:
Show transaction validation, authorization controls, confirmation workflows, and secure banking operations.

MONITORING:
Show security events, audit trails, risk classification, and suspicious-request monitoring.

ALL:
Display every feature.

Use smooth layout transitions when cards appear or disappear.

Do not simply create decorative filter buttons without functionality.

On smaller screens, make the filter bar horizontally scrollable without breaking the layout.

==================================================
5. SEARCH BAR
==================================================

Add a compact search field near the category filters.

Placeholder:

"Search security features..."

Include an appropriate search icon.

The search field should have:

- A dark background.
- A subtle border.
- Rounded corners.
- A smooth focus transition.
- A restrained blue focus ring.
- Clear placeholder text.

FUNCTIONALITY:

Users should be able to search for feature cards by their title or description.

The search must work together with the category filters.

For example, selecting THREAT DETECTION and searching for "prompt" should display only matching features within that category.

Display a clean empty state when no features match the selected category and search query.

Avoid unnecessary network requests. This should use local frontend data unless the existing architecture explicitly requires a backend integration.

==================================================
6. FEATURE CARDS GRID
==================================================

Below the category filters and search field, create a responsive grid of premium feature cards.

Follow the reference screenshot's general visual treatment:

- Dark charcoal cards.
- Rounded corners.
- Subtle borders.
- Small colored icons.
- Clear titles.
- Short descriptions.
- Comfortable internal spacing.
- Restrained ambient lighting.

Use four columns on large desktop screens when space permits.

Use two columns on tablets and one column on small mobile screens.

Do not force four columns when the viewport is too narrow.

Create the following cards.

CARD 1 — Prompt Injection Detection

Description:
"Detect instructions that attempt to override system policies or manipulate the AI into unsafe banking actions."

Icon:
Shield alert or scan search.

Accent:
Blue.

CARD 2 — Jailbreak Protection

Description:
"Identify attempts to bypass AI safeguards through roleplay, unrestricted instructions, or malicious requests."

Icon:
Shield check.

Accent:
Purple or blue.

CARD 3 — Policy Override Detection

Description:
"Recognize requests that attempt to disable mandatory banking rules, authorization checks, or transaction controls."

Icon:
Shield with warning.

Accent:
Red used sparingly.

CARD 4 — Malicious Memo Detection

Description:
"Inspect transaction descriptions and untrusted text for embedded instructions that should never control AI behavior."

Icon:
File search or scan text.

Accent:
Cyan.

CARD 5 — Obfuscation Detection

Description:
"Analyze suspicious character patterns and unusual formatting that may be used to evade basic text filters."

Icon:
Scan text or binary.

Accent:
Blue.

CARD 6 — Deterministic Policy Engine

Description:
"Apply explicit security rules to determine whether a request can proceed, must be blocked, or requires further review."

Icon:
Settings or workflow.

Accent:
Violet.

CARD 7 — Secure Tool Execution

Description:
"Prevent blocked requests from reaching privileged banking operations and enforce independent authorization checks."

Icon:
Lock or shield check.

Accent:
Green.

CARD 8 — Security Monitoring

Description:
"Record security events, risk classifications, and decisions to support investigation and system auditing."

Icon:
Activity or chart.

Accent:
Cyan.

CARD INTERACTIONS:

When a user hovers over a card:

- Move the card upward slightly.
- Increase its border brightness.
- Reveal a subtle ambient glow.
- Move or illuminate its icon very slightly.
- Increase the shadow depth.

Use a smooth transition with a premium feel.

The effect must remain restrained.

Do not use exaggerated 3D tilting, excessive scaling, or rapid color flashing.

On touch devices, preserve a clean, usable appearance without hover-dependent functionality.

==================================================
7. SCROLL-BASED ANIMATION
==================================================

The section should animate naturally as the user scrolls down the website.

Implement a carefully choreographed reveal sequence.

STAGE 1:
The section background and heading become visible.

STAGE 2:
The subtitle fades in.

STAGE 3:
The floating security icons gradually appear and move into position.

STAGE 4:
The category filters and search field appear.

STAGE 5:
The feature cards enter the viewport with a subtle staggered fade-and-rise animation.

STAGE 6:
The cards become fully visible and interactive.

Use a small stagger between cards so they do not all appear at exactly the same moment.

Prefer viewport-triggered and scroll-aware animations over complicated animation sequences that make the user wait.

IMPORTANT:

- Do not force the page to remain pinned while the user scrolls.
- Do not hijack normal browser scrolling.
- Do not introduce artificial scroll delays.
- Do not cause layout shifts.
- Do not reset every animation unexpectedly when the user scrolls slightly upward.
- Keep animations reversible where practical.
- Preserve a smooth experience on lower-powered devices.

The user should feel that the interface is responding naturally to their movement through the page.

==================================================
8. MOUSE INTERACTIONS
==================================================

Where appropriate, allow a very subtle pointer-based parallax effect on the floating icon collection.

As the user moves the mouse, foreground and background icon layers can shift by slightly different amounts.

This should create a gentle sense of depth.

Requirements:

- Very small movement distances.
- Smooth easing.
- No sudden jumps.
- No excessive rotation.
- No interference with clicking, selecting filters, or scrolling.

Disable or substantially reduce this effect on touch devices.

Do not let pointer movement cause excessive re-rendering or performance problems.

==================================================
9. DESIGN SYSTEM AND IMPLEMENTATION
==================================================

Before writing code, inspect the existing repository.

Identify:

- The frontend framework.
- The existing page and component structure.
- The current styling approach.
- Existing animation libraries.
- The current routing system.
- Existing icon libraries.
- Shared design tokens and CSS variables.

Use the existing project architecture.

If the application already uses React, implement this as a reusable React component.

Suggested component structure:

FeaturesSection
├── FeaturesHeader
├── FloatingSecurityIcons
├── FeatureControls
│   ├── CategoryFilters
│   └── FeatureSearch
└── FeatureGrid
    └── FeatureCard

Adapt this structure to the current codebase rather than creating unnecessary abstractions.

TECHNICAL REQUIREMENTS:

- Reuse installed dependencies.
- Prefer existing animation libraries if available.
- Do not install a new animation library without a clear reason.
- If the project already uses Framer Motion or Motion, use it appropriately.
- Otherwise, use CSS animations and the browser's native intersection APIs where sufficient.
- Keep the code readable and modular.
- Use semantic HTML.
- Ensure filters and search work correctly.
- Keep feature definitions in structured data rather than duplicating markup.
- Prevent unnecessary re-renders.
- Avoid horizontal overflow.
- Preserve the existing navigation and page layout.
- Do not rewrite unrelated components.
- Do not replace working functionality.

==================================================
10. ACCESSIBILITY AND PERFORMANCE
==================================================

The section must remain accessible and performant.

Requirements:

- Support keyboard navigation.
- Provide visible focus indicators.
- Give meaningful icons appropriate accessible labels when needed.
- Ensure sufficient contrast for important text.
- Use semantic buttons for interactive filters.
- Provide an appropriate accessible label for search.
- Respect prefers-reduced-motion.
- Reduce or disable continuous floating animations when reduced motion is requested.
- Avoid large, expensive blur effects across the entire viewport.
- Avoid excessive animated DOM elements.
- Keep the feature card layout stable while content loads.
- Ensure the section works at desktop, tablet, and mobile sizes.

Do not sacrifice usability for visual effects.

==================================================
11. FINAL VISUAL QUALITY
==================================================

The result should look like a custom-designed premium fintech website, not a generic template.

Pay special attention to:

- Heading placement.
- Typography and spacing.
- The three-dimensional arrangement of floating security icons.
- The contrast between the central visual display and dark background.
- The alignment of filters and search.
- Consistency between card styles.
- Subtle lighting and reflections.
- Smooth transitions.
- Overall visual balance.

The section should feel polished even when the animations are disabled.

Do not use excessive gradients on every element.

Do not cover the entire screen with glowing blue effects.

Keep the interface minimal, controlled, and visually coherent.

Use actual security-related icons rather than emoji.

Do not add random decorative text or fictitious statistics.

Do not add a separate navigation bar if the existing website already has one.

Do not add unrelated hero content.

==================================================
12. COMPLETION REQUIREMENTS
==================================================

Do not stop after generating a rough prototype.

Implement the complete section in the existing frontend.

After implementation:

1. Run the available development or build checks.
2. Fix TypeScript, JavaScript, CSS, and import errors.
3. Verify that the category filters work.
4. Verify that the search works with the active filter.
5. Test the responsive layout.
6. Check that hover and scroll animations work without interfering with normal scrolling.
7. Check that the section integrates correctly with neighboring sections.
8. Confirm that reduced-motion preferences are respected.

Preserve all unrelated existing functionality.

Do not claim to have tested something unless you actually tested it.

FINAL EXPECTATION:

A premium, dark Bankism Features section inspired by the attached reference, featuring floating 3D security icons, subtle reflections, elegant typography, functional filters and search, eight polished security feature cards, and smooth scroll-triggered animations.

The overall experience should communicate:

"Intelligent AI. Deterministic Security. Safer Banking."

Inspect the repository first, then implement the actual working interface.