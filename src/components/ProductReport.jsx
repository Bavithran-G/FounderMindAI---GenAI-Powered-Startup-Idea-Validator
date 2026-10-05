import React from 'react';

export const ProductReport = ({ data }) => (
  <div className="fade-in">

    {/* MVP Features */}
    <div className="report-section-title">
      <span className="report-section-icon">⚡</span>
      MVP Features
    </div>
    <div style={{ marginBottom: 28 }}>
      {data.mvpFeatures.map((f, i) => (
        <div key={i} className="mvp-feature">
          <div className="mvp-num">{i + 1}</div>
          <div className="mvp-text">{f}</div>
          <span
            className={`priority-badge ${i === 0 ? 'High' : i === 1 ? 'Medium' : 'Low'}`}
            style={{ flexShrink: 0 }}
          >
            {i === 0 ? 'Must Have' : i === 1 ? 'High Priority' : 'Important'}
          </span>
        </div>
      ))}
    </div>

    {/* Roadmap */}
    <div className="report-section-title">
      <span className="report-section-icon">◈</span>
      Development Roadmap
    </div>
    <div className="roadmap-grid" style={{ marginBottom: 28 }}>
      {data.roadmap.map((phase, i) => (
        <div key={i} className="roadmap-phase">
          <div className="roadmap-phase-name">{phase.phase}</div>
          <div className="roadmap-duration">{phase.duration}</div>
          {phase.goals.map((g, j) => (
            <div key={j} className="roadmap-goal">{g}</div>
          ))}
        </div>
      ))}
    </div>

    {/* User Flow */}
    <div className="report-section-title">
      <span className="report-section-icon">→</span>
      User Flow
    </div>
    <div className="user-flow" style={{ marginBottom: 28 }}>
      {data.userFlow.map((step, i) => (
        <div key={i} className="flow-step">
          <div className="flow-step-num">{i + 1}</div>
          <div className="flow-step-text">{step}</div>
        </div>
      ))}
    </div>

    {/* Tech Stack */}
    <div className="report-section-title">
      <span className="report-section-icon">⬡</span>
      Recommended Tech Stack
    </div>
    <div className="tech-grid">
      {data.techStack.map((cat, i) => (
        <div key={i} className="tech-category">
          <div className="tech-category-name">{cat.category}</div>
          <div>
            {cat.tools.map((tool, j) => (
              <span key={j} className="tech-tool">{tool}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
