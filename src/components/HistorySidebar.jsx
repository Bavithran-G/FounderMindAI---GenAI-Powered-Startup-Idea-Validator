import React, { useState } from 'react';
import { getHistory, deleteAnalysis } from '../utils/history';

function getScoreColor(score) {
  if (score >= 86) return '#059669';
  if (score >= 76) return '#10b981';
  if (score >= 66) return '#d97706';
  if (score >= 51) return '#f97316';
  if (score >= 36) return '#e11d48';
  return '#be123c';
}

export const HistorySidebar = ({ currentId, onSelect, onNewAnalysis, refreshKey, theme, onToggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const history = getHistory();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteAnalysis(id);
    window.dispatchEvent(new CustomEvent('history-updated'));
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="history-sidebar">
      <div className="sidebar-inner">

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-icon">✦</div>
            <span className="sidebar-logo">FounderMindAI</span>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* New Analysis Button */}
        <button
          className="sidebar-new-btn"
          onClick={onNewAnalysis}
          id="new-analysis-btn"
          title="New Analysis"
        >
          <span className="btn-icon">+</span>
          <span className="btn-text">New Analysis</span>
        </button>

        {/* Recent label */}
        <div className="sidebar-section-label" style={{ marginTop: 12 }}>
          Recent
        </div>

        {/* History List */}
        <div className="sidebar-history">
          {history.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">○</div>
              <div>No analyses yet</div>
            </div>
          ) : (
            history.map(item => {
              const score = item.marketResearch?.opportunityScore;
              const scoreColor = score ? getScoreColor(score) : null;

              return (
                <div
                  key={item.id}
                  className={`history-item ${item.id === currentId ? 'active' : ''}`}
                  onClick={() => onSelect(item)}
                  id={`history-${item.id}`}
                  title={item.idea}
                >
                  <div className="history-item-dot" />
                  <div className="history-item-body">
                    <div className="history-item-idea">{item.idea}</div>
                    {score !== undefined && (
                      <div className="history-item-meta">
                        <span
                          className="history-item-score"
                          style={{
                            color: scoreColor,
                            background: `${scoreColor}12`,
                            border: `1px solid ${scoreColor}25`,
                          }}
                        >
                          {(score / 10).toFixed(1)}/10
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    className="history-item-delete"
                    onClick={e => handleDelete(e, item.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="btn-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
