import React, { useEffect, useState } from "react";

export default function AnimatedNumber({ value, prefix = "", suffix = "", duration = 900 }) {
  const numericValue = Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(numericValue * eased);
      setDisplay(start);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [numericValue, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}