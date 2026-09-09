import { useEffect, useState } from 'react';

/**
 * Reports which section id is currently in view, so the nav can highlight it.
 * Uses a viewport band just under the fixed header rather than a plain
 * threshold, which keeps the highlight from flickering between two sections
 * on tall pages.
 *
 * `routeKey` re-runs the lookup after a route change: the sections do not
 * exist on a service page, so without it the observer would stay torn down
 * once the visitor navigated back to the home page.
 */
export default function useActiveSection(ids, routeKey = '') {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        if (!visible.size) return;
        // the most-visible section wins
        let best = null;
        let bestRatio = -1;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: '-88px 0px -55% 0px', threshold: [0.1, 0.35, 0.6, 1] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, routeKey]);

  return active;
}
