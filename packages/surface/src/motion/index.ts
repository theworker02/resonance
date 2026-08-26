/**
 * Surface Motion System
 *
 * Motion communicates state changes. It is not decoration.
 *
 * Categories:
 * - micro: 120–180ms (button press, toggle, hover)
 * - navigation: 180–260ms (page change, panel slide)
 * - state: 200–300ms (expand, collapse, reveal)
 * - spatial: 300–450ms (drill-down, hierarchy navigation)
 * - attention: 400–600ms (notification, alert)
 *
 * All durations respect `prefers-reduced-motion`.
 */

export const motion = {
  duration: {
    micro: '150ms',
    navigation: '220ms',
    state: '250ms',
    spatial: '350ms',
    attention: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    linear: 'linear',
  },
  // Pre-composed transitions
  transition: {
    micro: '150ms cubic-bezier(0.2, 0, 0, 1)',
    navigation: '220ms cubic-bezier(0, 0, 0.2, 1)',
    state: '250ms cubic-bezier(0.2, 0, 0, 1)',
    spatial: '350ms cubic-bezier(0, 0, 0.2, 1)',
  },
  // Reduced motion fallback
  reduced: {
    duration: '0ms',
    transition: '0ms linear',
  },
} as const

/**
 * Get the appropriate motion value, respecting reduced motion preference.
 */
export function getMotion(category: keyof typeof motion.duration): string {
  // In a browser context, check prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return motion.reduced.duration
  }
  return motion.duration[category]
}
