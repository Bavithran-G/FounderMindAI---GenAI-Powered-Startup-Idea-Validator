import React from 'react';
import { ScoreGauge } from './ScoreGauge';

export const InvestorReport = ({ data }) => {
  if (!data) return null;

  // Defensive fallbacks for every field the AI might omit or mis-type
  const fundingScore         = Number(data.fundingScore) || 0;
  const verdict              = data.verdict              || '—';
  const recommendedStage     = data.recommendedFundingStage || '—';
  const marketSizeAssessment = data.marketSizeAssessment   || '—';
  const defensibility        = data.defensibility          || '—';
  const fundingReasoning     = data.fundingScoreReasoning  || '';
  const vcQuestions          = Array.isArray(data.vcQuestions) ? data.vcQuestions : [];
  const risks                = Array.isArray(data.risks)       ? data.risks       : [];

  return (
    <div className="fade-in">

      {/* Score + Verdict */}
      <div className="report-grid" style={{ gridTemplateColumns: '180px 1fr', marginBottom: 24 }}>
        <div className="report-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ScoreGauge score={fundingScore} label="Funding Score" size={140} />
        </div>
        <div>
          <div className="highlight-box" style={{ marginBottom: 12 }}>
            <div className="highlight-box-label">VC Verdict</div>
            <div className="highlight-box-text">{verdict}</div>
          </div>
          <div className="tag-list">
            <span className="tag tag-indigo" style={{ fontSize: 13 }}>
              Stage: {recommendedStage}
            </span>
          </div>

          {/* Score reasoning if present */}
          {fundingReasoning && (
            <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {fundingReasoning}
            </div>
          )}
        </div>
      </div>

      {/* Market & Defensibility */}
      <div className="report-grid" style={{ marginBottom: 24 }}>
        <div className="report-card">
          <div className="report-card-label">Market Size Assessment</div>
          <div className="report-card-value">{marketSizeAssessment}</div>
        </div>
        <div className="report-card">
          <div className="report-card-label">Defensibility</div>
          <div className="report-card-value">{defensibility}</div>
        </div>
      </div>

      {/* VC Due Diligence Questions */}
      {vcQuestions.length > 0 && (
        <>
          <div className="report-section-title" style={{ marginBottom: 14 }}>
            <span className="report-section-icon">?</span>
            VC Due Diligence
          </div>
          <div style={{ marginBottom: 26 }}>
            {vcQuestions.map((q, i) => (
              <div key={i} className="vc-question">
                <div className="vc-q-label">Q{i + 1}</div>
                <div className="vc-q-text">{q?.question || '—'}</div>
                <div className="vc-a-text">{q?.answer   || '—'}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <>
          <div className="report-section-title" style={{ marginBottom: 14 }}>
            <span className="report-section-icon">▲</span>
            Key Risks &amp; Mitigations
          </div>
          {risks.map((r, i) => (
            <div key={i} className="risk-card">
              <div className="risk-label">Risk {i + 1}</div>
              <div className="risk-value">{r?.risk       || '—'}</div>
              <div className="mitigation-label">Mitigation</div>
              <div className="mitigation-value">{r?.mitigation || '—'}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
