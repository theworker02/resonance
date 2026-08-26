# Responsive Design Specification (Item 127)

## Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `sm` | 640px | Mobile (technician) |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large monitor |

## Layout Strategy

- **Desktop (xl+)**: Full sidebar + content + optional detail panel
- **Laptop (lg)**: Collapsed icon sidebar + content
- **Tablet (md)**: Bottom navigation + full-width content
- **Mobile (sm)**: Stack navigation + focused single-view

## What MUST work on mobile (technician)
- Node self-test
- Health dashboard
- Service checklist
- QR scan for node identification
- Basic incident list
- Push notifications

## What is desktop-optimized (no mobile equivalent needed)
- Evidence graph visualization
- APS surface rendering
- Model comparison views
- Multi-column deployment wizard
- Fleet map with cell overlays
