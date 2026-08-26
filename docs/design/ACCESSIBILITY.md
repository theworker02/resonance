# Accessibility Specification

## Target Compliance
WCAG 2.1 Level AA

## Requirements

### Keyboard Navigation (Item 112)
- All interactive elements reachable via Tab
- Logical tab order follows visual layout
- Custom shortcuts documented in command palette
- Focus trap in modals and command palette
- Skip-to-content link on every page
- Arrow keys navigate within composite widgets (tables, menus)

### Screen Reader Support
- All images have alt text or are marked decorative
- Live regions for real-time updates (ARIA live)
- Headings form a logical hierarchy (h1 → h2 → h3)
- Form inputs have associated labels
- Error messages linked to fields via aria-describedby
- Data tables use proper th/scope attributes

### Visual
- Minimum contrast ratio 4.5:1 for text, 3:1 for UI components
- Focus indicators visible (3px solid, brand-focus color)
- Color is never the sole indicator of state
- Text resizable to 200% without loss of functionality

### Motion
- All animations respect `prefers-reduced-motion`
- No flashing content (< 3 flashes per second)
- Auto-playing animations have pause control

### Forms
- All required fields marked (asterisk + aria-required)
- Inline validation errors appear on blur
- Error summary at form top links to problematic fields
- Submit buttons show loading state

## Testing
- axe-core in CI (zero critical/serious violations)
- Manual screen reader testing (VoiceOver, NVDA) before release
- Keyboard-only navigation testing per feature
