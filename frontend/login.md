Login page: 

Act as a world-class frontend engineer, UI/UX designer, and creative motion designer.

Your task is to implement a stunning, production-quality LOGIN PAGE for my existing project:

BANKISM — AI Firewall for Secure Banking.

I have attached a login-page screenshot as the visual reference. Study the image carefully and recreate its visual style, layout, lighting, colors, glassmorphism, typography, and interactions, adapting the content to Bankism.

IMPORTANT:
Do not merely generate a design explanation or code snippets. Inspect my existing repository, implement the actual login page, integrate it with the existing authentication system, and verify that it works.

Do not overwrite working functionality or modify unrelated pages.

==================================================
1. DESIGN VISION
==================================================

Create a premium, cinematic login experience inspired by the attached screenshot.

The visual experience should combine:

- A deep black and midnight-navy background.
- Flowing multicolored light ribbons.
- Sophisticated glassmorphism.
- A translucent login card.
- Thin, elegant borders.
- Soft blue, cyan, violet, and subtle magenta lighting.
- Beautiful typography and generous spacing.
- Smooth, refined animations.

The result should feel like a modern AI-powered financial security platform.

The design should be visually impressive but remain professional and trustworthy.

Avoid generic banking templates, excessive gradients on individual UI elements, cartoon illustrations, unnecessary dashboards, and cluttered layouts.

==================================================
2. BACKGROUND — FLOWING LIGHT RIBBONS
==================================================

Recreate the most distinctive feature of the reference image: the abstract, colorful light ribbons flowing through a dark background.

Create an immersive background using layered gradients, soft blurred light trails, and smooth curves.

COLOR PALETTE:

- Background: near-black and midnight navy.
- Primary light: electric blue.
- Secondary light: cyan.
- Additional accents: violet, magenta, and restrained warm orange.
- Form text: white and muted silver.
- Borders: translucent white and cool blue.

VISUAL DETAILS:

- Create multiple flowing ribbons with different curves and depths.
- Use soft bloom-like lighting around selected sections.
- Allow some ribbons to pass behind the login card.
- Make the background feel spatial and atmospheric.
- Keep the central login form readable against the background.
- Use subtle gradients to suggest depth without overwhelming the page.

IMPLEMENTATION:

Prefer lightweight CSS gradients, pseudo-elements, SVG paths, and CSS blur effects.

If the project already has an appropriate animation library, reuse it.

Do not introduce a heavyweight 3D engine just to create this effect.

The ribbons should move slowly and continuously, creating an elegant ambient animation.

Use different animation durations and directions to prevent the background from looking repetitive.

The light ribbons must remain decorative and must never obstruct the form.

Do not use flashing lights, rapid color changes, excessive blur, or distracting particle effects.

==================================================
3. CENTRAL GLASS LOGIN CARD
==================================================

Place a translucent login card near the center of the screen.

Follow the reference image's overall composition.

CARD APPEARANCE:

- Dark translucent background.
- Backdrop blur, where supported.
- Thin, subtle border.
- Rounded corners.
- Soft shadows.
- Restrained reflections from the background lights.
- A clean, spacious interior.
- Consistent alignment and generous padding.

The card should appear to float gently above the background.

Use a subtle blue or violet glow around the edges, but keep it understated.

The card must remain visually stable. It should not continuously rotate, tilt, or move around the screen.

On desktop, use a compact card approximately 380–440px wide, adjusting the dimensions to the existing site's design.

On mobile, use a responsive card with appropriate side margins and padding.

Never force a fixed card height that causes content to overflow.

==================================================
4. BANKISM BRANDING
==================================================

Replace the reference image's branding with Bankism.

At the top of the login card, display a small, elegant brand identity.

Brand name:
"Bankism"

Subtitle:
"AI Firewall for Secure Banking"

Use an appropriate shield or security icon from the icon library already installed in the project.

Keep the branding compact and sophisticated.

Do not add an oversized illustration that competes with the form.

==================================================
5. LOGIN FORM
==================================================

Use the following content.

HEADING:
"Welcome Back"

SUBHEADING:
"Sign in to your secure banking account."

FIELD 1:
Label: "Email Address"
Placeholder: "Enter your email address"

FIELD 2:
Label: "Password"
Placeholder: "Enter your password"

Under the password field, include:

- A "Remember me" checkbox.
- A "Forgot password?" link, if a corresponding route or workflow exists.

PRIMARY BUTTON:
"Sign In"

BOTTOM TEXT:
"Don't have an account? Create account"

The Create account link should navigate to the existing registration page.

FORM DESIGN:

- Transparent or translucent input backgrounds.
- Thin, low-contrast borders.
- White text.
- Muted placeholder text.
- Smooth focus transitions.
- Subtle blue focus borders.
- Appropriate spacing between fields.
- Clear labels.
- A full-width primary button.

The primary button should use a refined dark-to-blue gradient or a clean white treatment, whichever fits the existing design system best.

On hover, introduce a restrained color transition and subtle glow.

On click, provide a clear pressed state.

Avoid excessive scaling, bouncing, or dramatic animations.

==================================================
6. INPUT INTERACTIONS
==================================================

Implement complete form interactions.

EMAIL FIELD:
- Validate the email format.
- Display a clear message for invalid input.
- Preserve the entered value when appropriate.

PASSWORD FIELD:
- Mask the password by default.
- Provide a show/hide password control.
- Use an appropriate accessible eye icon.
- Keep the control visually aligned with the input.

REMEMBER ME:
- Implement a real checkbox.
- Persist only the intended preference.
- Follow the existing authentication architecture.
- Do not store passwords in localStorage.

SIGN-IN BUTTON:
- Disable duplicate submissions while a request is processing.
- Display an appropriate loading indicator.
- Prevent accidental repeated submissions.
- Display authentication errors in an understandable form.
- Restore the button appropriately after a failed request.

KEYBOARD SUPPORT:
- Allow normal Tab navigation.
- Support Enter to submit the form.
- Provide visible focus indicators.

All interactive controls must work. Do not create decorative controls that do nothing.

==================================================
7. AUTHENTICATION INTEGRATION
==================================================

This is a banking application, so the login form must integrate with the existing backend.

Before implementing authentication, inspect:

- The current frontend framework.
- Existing authentication components and hooks.
- The current API client.
- The backend login endpoint.
- The existing route configuration.
- The authentication response format.
- The existing session or token-management strategy.

Reuse the established authentication architecture.

Do not invent backend endpoints if the project already defines them.

For Bankism, the existing backend may expose:

POST /api/v1/auth/login

Verify the actual endpoint and response structure before using it.

The login form must:

1. Submit the user's credentials securely over HTTPS in production.
2. Handle the actual backend response.
3. Display appropriate validation and authentication errors.
4. Follow the backend's account-status and authorization rules.
5. Establish the session using the existing secure authentication strategy.
6. Redirect the user according to the existing application's routing and authorization logic.

Do not hardcode credentials.

Do not fabricate successful authentication.

Do not redirect users to a protected banking dashboard if authentication fails.

Do not bypass pending, frozen, blocked, or rejected account restrictions enforced by the backend.

Do not store passwords in browser storage.

If the current backend uses JWT authentication, follow its existing token-handling architecture rather than creating a separate authentication mechanism.

If registration or password recovery has not been implemented, do not pretend those workflows exist. Keep links consistent with the application's actual capabilities.

==================================================
8. ANIMATIONS
==================================================

The page should feel alive from the moment it loads.

INITIAL ENTRANCE:

1. The dark background appears.
2. The light ribbons gradually become visible.
3. The login card fades in with a slight upward movement.
4. The Bankism logo and heading appear.
5. The form fields become visible.
6. The primary button settles into its normal state.

Use staggered animations with subtle timing differences.

BACKGROUND ANIMATION:

- Slowly move the light ribbons along their curves.
- Vary their opacity and illumination gently.
- Allow the colors to blend naturally.
- Keep the movement calm and continuous.

CARD ANIMATION:

- Fade in smoothly.
- Move upward by a small distance.
- Settle without bouncing.
- Do not continuously animate the card's position.

INPUT ANIMATION:

- Highlight the active input with a subtle border-color transition.
- Use a restrained blue focus glow.
- Avoid sudden flashing.

BUTTON ANIMATION:

- Smooth hover transition.
- Subtle highlight.
- Clear active state.
- Loading animation while authentication is in progress.

Use CSS animations or the animation framework already installed.

Respect the user's prefers-reduced-motion setting.

When reduced motion is enabled, substantially reduce or disable continuous background animation and entrance transitions.

==================================================
9. RESPONSIVE DESIGN
==================================================

The reference image uses a tall composition. Adapt the layout to the user's screen rather than forcing every device into the same dimensions.

DESKTOP:
- Full-viewport dark background.
- Centered login card.
- Rich background ribbons extending across the viewport.
- Generous space around the card.

TABLET:
- Preserve the central composition.
- Adjust card width and padding.
- Reduce unnecessary background effects.

MOBILE:
- Keep the login form fully visible.
- Use appropriate horizontal margins.
- Reduce background complexity where necessary.
- Prevent horizontal overflow.
- Make inputs and buttons comfortable to use.
- Ensure the keyboard does not make the form unusable.
- Maintain sufficient contrast and readable text.

Use min-height: 100svh or an appropriate responsive equivalent where suitable.

Do not force the entire page to have a fixed height.

==================================================
10. ACCESSIBILITY AND SECURITY
==================================================

Ensure the form is accessible and usable.

Requirements:

- Proper labels for all inputs.
- Accessible names for icon-only buttons.
- Keyboard navigation.
- Visible focus indicators.
- Appropriate text contrast.
- Clear error messages.
- Semantic form markup.
- Appropriate autocomplete attributes.
- Accessible loading and submission states.

For authentication:

- Never expose password hashes, JWT secrets, API keys, or backend internals.
- Never log passwords.
- Avoid displaying raw backend exceptions.
- Do not weaken the existing security controls.
- Follow the application's existing session and token-management approach.
- Do not introduce client-side role checks as a replacement for backend authorization.

The visual effects must never interfere with typing, clicking, or reading the form.

==================================================
11. CODE QUALITY AND PROJECT INTEGRATION
==================================================

Before modifying files, inspect the repository.

Identify the existing frontend architecture, CSS approach, dependencies, routing, design tokens, and authentication flow.

Implement the login page using the project's existing conventions.

Prefer a reusable component structure where appropriate:

LoginPage
├── AnimatedBackground
├── LoginCard
│   ├── BankismBrand
│   ├── LoginHeader
│   ├── LoginForm
│   ├── RememberMe
│   ├── PasswordVisibilityToggle
│   ├── SignInButton
│   └── RegistrationLink

Adapt this structure to the actual repository.

Do not create unnecessary abstractions.

Do not duplicate existing components.

Do not replace the entire application with a newly generated project.

Do not introduce new dependencies without a genuine reason.

Keep the implementation maintainable, responsive, and consistent with the rest of Bankism.

==================================================
12. FINAL VALIDATION
==================================================

After implementation:

1. Run the available frontend build or validation commands.
2. Fix import errors and styling problems.
3. Verify that the login form renders correctly.
4. Verify email and password validation.
5. Test password visibility.
6. Test loading and error states.
7. Verify the actual authentication integration.
8. Verify navigation to the registration page.
9. Check responsive behavior.
10. Check that the animated background does not block user interactions.
11. Verify reduced-motion behavior.
12. Ensure unrelated pages continue to work.

Do not claim that a test passed unless it was actually executed.

If a required backend endpoint is unavailable, report the limitation instead of simulating successful authentication.

FINAL EXPECTATION:

A premium Bankism login page inspired by the attached reference, featuring an immersive dark background, flowing multicolored light ribbons, a translucent glass login card, elegant typography, refined form controls, smooth animations, and real integration with the existing authentication system.

The design should communicate:

"Secure Access. Intelligent Banking. Trusted Protection."

Inspect the repository first, then implement the complete working login page.