import React from 'react';

export const BusinessReport = ({ data }) => (
  <div className="fade-in">

    {/* Value Proposition */}
    <div className="highlight-box" style={{ marginBottom: 22 }}>
      <div className="highlight-box-label">Value Proposition</div>
      <div className="highlight-box-text">{data.valueProposition}</div>
    </div>

    {/* Key Info */}
    <div className="report-grid" style={{ marginBottom: 24 }}>
      <div className="report-card">
        <div className="report-card-label">Competitive Moat</div>
        <div className="report-card-value">{data.moat}</div>
      </div>
      <div className="report-card">
        <div className="report-card-label">Unique Selling Point</div>
        <div className="report-card-value">{data.usp}</div>
      </div>
      <div className="report-card">
        <div className="report-card-label">Revenue Model</div>
        <div className="report-card-value">{data.revenueModel}</div>
      </div>
    </div>

    {/* Pricing Tiers */}
    <div className="report-section-title">
      <span className="report-section-icon">◈</span>
      Pricing Tiers
    </div>
    <div className="pricing-grid" style={{ marginBottom: 24 }}>
      {data.pricingTiers.map((tier, i) => (
        <div key={i} className={`pricing-card ${i === 1 ? 'featured' : ''}`}>
          <div className="pricing-tier-name">{tier.name}</div>
          <div className="pricing-price">{tier.price}</div>
          {tier.features.map((f, j) => (
            <div key={j} className="pricing-feature">
              <span className="pricing-check">✓</span>
              {f}
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Customer Segments */}
    <div className="report-section-title">
      <span className="report-section-icon">◉</span>
      Customer Segments
    </div>
    <div className="tag-list">
      {data.customerSegments.map((seg, i) => (
        <span key={i} className="tag tag-indigo" style={{ fontSize: 13, padding: '6px 14px' }}>
          {seg}
        </span>
      ))}
    </div>
  </div>
);
