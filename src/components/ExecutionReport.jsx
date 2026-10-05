import React, { useState } from 'react';

export const ExecutionReport = ({ data }) => {
  const [period, setPeriod] = useState('30');
  if (!data) return null;
  const day30 = Array.isArray(data.day30) ? data.day30 : [];
  const day60 = Array.isArray(data.day60) ? data.day60 : [];
  const day90 = Array.isArray(data.day90) ? data.day90 : [];
  const tasks = period === '30' ? day30 : period === '60' ? day60 : day90;
  const milestones = Array.isArray(data.milestones) ? data.milestones : [];
  const kpis       = Array.isArray(data.kpis)       ? data.kpis       : [];

  return (
    <div className="fade-in">

      {/* Milestones */}
      <div className="report-section-title">
        <span className="report-section-icon">◆</span>
        Key Milestones
      </div>
      <div style={{ marginBottom: 26 }}>
        {milestones.map((m, i) => (
          <div key={i} className="milestone-item">
            <span className="milestone-icon">
              {i === 0 ? '▷' : i === 1 ? '▶' : '▮'}
            </span>
            <div className="milestone-text">{m}</div>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="report-section-title">
        <span className="report-section-icon">◉</span>
        Key Performance Indicators
      </div>
      <div className="tag-list" style={{ marginBottom: 26 }}>
        {kpis.map((kpi, i) => (
          <span key={i} className="tag tag-blue" style={{ fontSize: 12.5, padding: '6px 13px' }}>
            {kpi}
          </span>
        ))}
      </div>

      {/* 30/60/90 Action Plan */}
      <div className="report-section-title">
        <span className="report-section-icon">◈</span>
        Action Plan
      </div>
      <div className="timeline-tabs">
        {['30', '60', '90'].map(p => (
          <button
            key={p}
            id={`timeline-tab-${p}`}
            className={`timeline-tab ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            Day {p}
          </button>
        ))}
      </div>

      <div key={period}>
        {tasks.map((task, i) => (
          <div key={i} className="timeline-task">
            <div className={`priority-dot priority-${task.priority}`} />
            <div className="task-content">
              <div className="task-text">{task.task}</div>
              <div className="task-owner">↳ {task.owner}</div>
            </div>
            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
