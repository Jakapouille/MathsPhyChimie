// src/components/TrackBehavior.jsx
import { useEffect, useRef, useState } from "react";

export default function TrackBehavior({ pageId }) {
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const handleClick = () => setClicks((c) => c + 1);
    const handleCopy = () => setCopied(true);
    const handleScroll = () => {
      const depth = window.scrollY + window.innerHeight;
      setScrollDepth((prev) => Math.max(prev, depth));
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("scroll", handleScroll);

      const timeSpent = Date.now() - startTime.current;

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, clicks, copied, scrollDepth, timeSpent }),
      });
    };
  }, [clicks, copied, scrollDepth, pageId]);

  return null; // Composant invisible
}
