# Surface Motion Specification

## Principles

1. Motion communicates state — it is not decoration
2. Every animation must have a functional purpose
3. Respect `prefers-reduced-motion` unconditionally
4. Fast micro-interactions build perceived performance
5. Spatial transitions reinforce hierarchy

## Categories

| Category | Duration | Easing | Use Case |
|----------|----------|--------|----------|
| Micro | 120–180ms | default | Button press, toggle, hover state |
| Navigation | 180–260ms | enter | Route transition, panel slide |
| State | 200–300ms | default | Expand/collapse, reveal, accordion |
| Spatial | 300–450ms | enter | Drill-down (deployment→cell→node) |
| Attention | 400–600ms | spring | Notification, toast, alert badge |

## Easing Curves

- **Default** `cubic-bezier(0.2, 0, 0, 1)` — General purpose, slightly decelerating
- **Enter** `cubic-bezier(0, 0, 0.2, 1)` — Elements appearing (fast start, gentle stop)
- **Exit** `cubic-bezier(0.4, 0, 1, 1)` — Elements disappearing (gentle start, fast finish)
- **Spring** `cubic-bezier(0.34, 1.56, 0.64, 1)` — Attention-grabbing overshoot

## Spatial Transitions

When navigating deeper into the system hierarchy:

```
Deployment → Cell → Node
```

The transition should feel like zooming in. Content slides and scales subtly to reinforce that the user is moving deeper into the same system.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All durations collapse to 0ms
- Opacity changes are instant
- Layout shifts use no animation
- Focus indicators remain visible (they are not animations)

## Implementation

```css
.surface-transition-micro {
  transition: all 150ms cubic-bezier(0.2, 0, 0, 1);
}

@media (prefers-reduced-motion: reduce) {
  .surface-transition-micro {
    transition: none;
  }
}
```
