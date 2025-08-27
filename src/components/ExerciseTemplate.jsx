// src/components/ExerciseTemplate.jsx
import { useEffect, useRef, useState } from "react";

export default function ExerciseTemplate({ template, exerciseId }) {
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const startTime = useRef(Date.now());
  const throttleRef = useRef(Date.now());

  useEffect(() => {
    const throttle = 300; // en ms pour limiter les requêtes scroll

    const handleClick = () => setClicks((c) => c + 1);
    const handleCopy = () => setCopied(true);
    const handleScroll = () => {
      if (Date.now() - throttleRef.current < throttle) return;
      throttleRef.current = Date.now();
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
        body: JSON.stringify({
          pageId: `exercise-${exerciseId}`,
          exerciseId,
          templateId: template.id,
          clicks,
          copied,
          scrollDepth,
          timeSpent,
        }),
      });
    };
  }, [clicks, copied, scrollDepth, exerciseId, template.id]);

  return (
    <div className="exercise-template p-4 bg-gray-800 rounded mb-6 text-white">
      <h2 className="text-xl font-bold mb-2">{template.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: template.content }} />
      {template.type === "QCM" && (
        <div className="mt-4">
          {template.options.map((opt, idx) => (
            <button key={idx} className="m-1 p-2 bg-blue-600 rounded">{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}
