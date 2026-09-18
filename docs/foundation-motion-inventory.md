# Motion Foundation Inventory

Status: FI-001 Phase 4 working inventory.
Updated: 2026-09-18

## Canonical authority

Motion Foundation owns the rule for **whether motion is allowed to animate**, not every component's business timing API.

The reduced-motion authority has three layers:

1. `src/base.css` — CSS animations, transitions and CSS scroll behavior collapse to zero/auto under `prefers-reduced-motion: reduce`.
2. `src/lib/motion.ts` — imperative JavaScript queries the same media preference and resolves motion-sensitive behaviors such as smooth scrolling.
3. `src/hooks/use-reduced-motion.ts` — React components that render or schedule motion react to live preference changes.

Component-specific timing such as Carousel `speed` or notification lifetime remains component API. Reduced-motion decides whether visual movement occurs; it does not redefine unrelated delays such as message persistence.

## Confirmed defects

### JavaScript smooth scroll bypass

Core Anchor and BackTop called:

`window.scrollTo({ ..., behavior: "smooth" })`

CSS `scroll-behavior: auto` cannot override an imperative ScrollToOptions behavior, so reduced-motion users still received smooth viewport movement.

Both components now resolve behavior through `preferredScrollBehavior()`.

### Inline Carousel motion bypass

Carousel used inline `transitionDuration: ${speed}ms` and inline autoplay-dot animation. Ordinary stylesheet `transition-duration: 0s` / `animation-duration: 0s` does not reliably outrank inline author styles.

The global reduced-motion CSS is therefore `!important`, while Carousel also consumes the live reduced-motion hook so:

- autoplay does not run;
- navigation completes without the animation timer;
- inline track/fade duration resolves to `0ms`;
- autoplay progress animation is not rendered.

Carousel already blocked autoplay when reduced motion was detected; the Foundation work consolidates that local query into the shared authority and closes the remaining inline/lifecycle gaps.

## Corpus policy

Core/Gouno/Patterns/Product code must not:

- hard-code imperative `behavior: "smooth"` outside the Motion authority;
- create a second direct `matchMedia("(prefers-reduced-motion: reduce)")` query;
- weaken the global reduced-motion override so inline duration can escape it.

Motion-related CSS classes remain allowed because the global reduced-motion rule is the system-level opt-out.

## Acceptance

Motion can be certified only when:

1. CSS and JavaScript resolve the same reduced-motion preference.
2. Anchor and BackTop use `auto` scrolling under reduced motion and `smooth` otherwise.
3. Carousel autoplay and change animation stop under reduced motion while lifecycle callbacks remain correct.
4. direct JS smooth-scroll and direct reduced-motion query bypasses are zero.
5. browser evidence verifies reduced-motion behavior.
6. reciprocal Blog/Gosso consumer parity passes.
