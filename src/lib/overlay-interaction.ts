const transientPortalSelector = [
  '[data-slot="popover-content"]',
  '[data-slot="dropdown-menu-content"]',
  '[data-slot="tooltip-content"]',
].join(",");

type OutsideInteractionEvent = {
  target: EventTarget | null;
  detail?: {
    originalEvent?: {
      target?: EventTarget | null;
    };
  };
};

export function isTransientPortalInteraction(
  event: OutsideInteractionEvent,
): boolean {
  const target = event.detail?.originalEvent?.target ?? event.target;
  return target instanceof Element && Boolean(target.closest(transientPortalSelector));
}
