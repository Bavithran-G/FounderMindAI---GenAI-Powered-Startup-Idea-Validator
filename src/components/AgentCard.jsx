import React from 'react';

export const AGENT_CONFIGS = [
  {
    key: 'marketResearch',
    name: 'Market',
    fullName: 'Market Research',
    desc: 'Competitors, trends, opportunity score',
    icon: '◈',
    accent: '#2563eb',
    bg: 'rgba(37,99,235,0.07)',
    border: 'rgba(37,99,235,0.15)',
  },
  {
    key: 'businessStrategy',
    name: 'Strategy',
    fullName: 'Business Strategist',
    desc: 'Revenue model, pricing, value prop',
    icon: '◆',
    accent: '#4f46e5',
    bg: 'rgba(79,70,229,0.07)',
    border: 'rgba(79,70,229,0.15)',
  },
  {
    key: 'productArchitect',
    name: 'Product',
    fullName: 'Product Architect',
    desc: 'MVP features, roadmap, tech stack',
    icon: '⬡',
    accent: '#059669',
    bg: 'rgba(5,150,105,0.07)',
    border: 'rgba(5,150,105,0.15)',
  },
  {
    key: 'investor',
    name: 'Investor',
    fullName: 'VC Investor',
    desc: 'Funding score, defensibility, risks',
    icon: '◉',
    accent: '#d97706',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.15)',
  },
  {
    key: 'pitchDeck',
    name: 'Pitch',
    fullName: 'Pitch Deck',
    desc: '8-slide investor pitch deck',
    icon: '▣',
    accent: '#7c3aed',
    bg: 'rgba(124,58,237,0.07)',
    border: 'rgba(124,58,237,0.15)',
  },
  {
    key: 'execution',
    name: 'Execution',
    fullName: 'Execution Planner',
    desc: '30/60/90-day action plan & KPIs',
    icon: '◎',
    accent: '#0891b2',
    bg: 'rgba(8,145,178,0.07)',
    border: 'rgba(8,145,178,0.15)',
  },
];

const STATUS_CONFIG = {
  idle:     { label: 'Pending',   className: 'idle' },
  running:  { label: 'Running',   className: 'running' },
  complete: { label: 'Done',      className: 'complete' },
  error:    { label: 'Error',     className: 'error' },
};

export const AgentCard = ({ config, status }) => {
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <div
      className={`agent-card ${status}`}
      style={{ '--agent-accent': `linear-gradient(90deg, ${config.accent}, ${config.accent}88)` }}
    >
      <div className="agent-card-header">
        <div
          className="agent-icon"
          style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.accent }}
        >
          {config.icon}
        </div>
        <div className={`agent-status ${sc.className}`}>
          <span className="status-dot-sm" />
          {sc.label}
          {status === 'running' && (
            <span className="mini-spinner" style={{ width: 10, height: 10, borderWidth: 1.5, borderTopColor: config.accent, marginLeft: 4 }} />
          )}
        </div>
      </div>
      <div className="agent-name">{config.name}</div>
      <div className="agent-desc">{config.desc}</div>
    </div>
  );
};
