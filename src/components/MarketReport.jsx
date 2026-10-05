import React from 'react';
import { ScoreGauge } from './ScoreGauge';

export const MarketReport = ({ data }) => {
  if (!data) return null;
  const competitors = Array.isArray(data.competitors) ? data.competitors : [];
  const trends      = Array.isArray(data.trends)      ? data.trends      : [];
  const gaps        = Array.isArray(data.gaps)         ? data.gaps        : [];
  const score       = Number(data.opportunityScore) || 0;

  return (
    <div className="fade-in">

      {/* Score + Analysis */}
      <div className="report-grid" style={{ gridTemplateColumns: '180px 1fr', marginBottom: 24 }}>
        <div className="report-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScoreGauge score={score} label="Opportunity Score" size={140} />
        </div>
        <div className="report-card">
          <div className="report-card-label">Market Analysis</div>
          <div className="report-card-value" style={{ fontSize: 14.5, lineHeight: 1.7 }}>{data.analysis || '—'}</div>
          <div style={{ marginTop: 14 }}>
            <span className="tag tag-emerald" style={{ fontSize: 13 }}>
              TAM: {data.targetMarketSize || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Competitors */}
      {competitors.length > 0 && (
        <>
          <div className="report-section-title">
            <span className="report-section-icon">⚔</span>
            Competitors ({competitors.length})
          </div>
          <div className="report-grid" style={{ marginBottom: 24 }}>
            {competitors.map((c, i) => (
              <div key={i} className="competitor-card">
                <div className="competitor-name">{c?.name || '—'}</div>
                <div className="competitor-desc">{c?.description || '—'}</div>
                <div className="competitor-weakness">⚠ {c?.weakness || '—'}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trends & Gaps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div className="report-section-title">
            <span className="report-section-icon">↗</span>
            Market Trends
          </div>
          <div className="tag-list">
            {trends.map((t, i) => (
              <span key={i} className="tag tag-blue">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="report-section-title">
            <span className="report-section-icon">○</span>
            Market Gaps
          </div>
          <div className="user-flow">
            {gaps.map((g, i) => (
              <div key={i} className="flow-step">
                <div className="flow-step-num">{i + 1}</div>
                <div className="flow-step-text">{g}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
