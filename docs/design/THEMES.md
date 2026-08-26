# Theme Specification

## Supported Modes
- **Dark** (default) — optimized for extended monitoring sessions
- **Light** — high ambient light environments
- **System** — follows OS preference

## Implementation
Theme switching applies new CSS custom property values to `:root`. Components read from tokens only — never hard-code colors.

## High Contrast Mode
When `prefers-contrast: more` is detected:
- Border widths increase to 2px
- Text contrast increases to 7:1 minimum
- Shadows are replaced with solid borders
- Focus indicators become 4px width

## Density Modes
- **Compact**: dense tables, small padding — for experienced operators with large datasets
- **Default**: balanced — the standard experience
- **Comfortable**: generous spacing — presentations, reviews, new users
