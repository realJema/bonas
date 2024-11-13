import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);

    updateMatch(); // Initial check

    if (media.addListener) {
      media.addListener(updateMatch);
      return () => media.removeListener(updateMatch);
    } else {
      media.addEventListener("change", updateMatch);
      return () => media.removeEventListener("change", updateMatch);
    }
  }, [query]);

  return matches;
}
