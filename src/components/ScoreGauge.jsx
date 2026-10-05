import React, { useEffect, useRef, useState } from 'react';

function getScoreBand(score) {
  if (score >= 86) return { color: '#059669', band: 'Exceptional' };
  if (score >= 76) return { color: '#10b981', band: 'Strong' };
  if (score >= 66) return { color: '#d97706', band: 'Above Avg' };
  if (score >= 51) return { color: '#f97316', band: 'Average' };
  if (score >= 36) return { color: '#e11d48', band: 'Weak' };
  return { color: '#be123c', band: 'Poor' };
}

export const ScoreGauge = ({ score, label, size = 120 }) => {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [score]);

  const { color: scoreColor, band } = getScoreBand(score);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayed / 100) * circumference;

  return (
    <div className="score-gauge-container">
      <svg width={size} height={size} className="gauge-svg" style={{ '--gauge-color': scoreColor }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth={7}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.04s linear' }}
        />
        <text
          x={size / 2} y={size / 2 - 5}
          textAnchor="middle" dominantBaseline="middle"
          fill={scoreColor}
          fontFamily="Space Grotesk, sans-serif"
          fontSize={size * 0.22} fontWeight="700"
        >
          {displayed}
        </text>
        <text
          x={size / 2} y={size / 2 + size * 0.15}
          textAnchor="middle" dominantBaseline="middle"
          fill="rgba(100,116,139,0.7)"
          fontFamily="Inter, sans-serif"
          fontSize={size * 0.1}
        >
          /100
        </text>
      </svg>

      <div className="gauge-label">{label}</div>

      <div
        className="gauge-band"
        style={{
          color: scoreColor,
          background: `${scoreColor}14`,
          border: `1px solid ${scoreColor}30`,
        }}
      >
        {band}
      </div>
    </div>
  );
};
