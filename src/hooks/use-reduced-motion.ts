import { useEffect, useState } from "react";
import {
  REDUCED_MOTION_QUERY,
  prefersReducedMotion,
} from "../lib/motion";

export function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setReduced(query.matches);
    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener?.(update);
    return () => query.removeListener?.(update);
  }, []);

  return reduced;
}
